"use client";

import { useEffect, useState } from "react";
import {
  criarContato,
  criarAnotacao,
  editarAnotacao,
  excluirAnotacao,
  gerarFollowUp,
  listarAnotacoes,
} from "./acoes";

// Data legível em português: "1 de setembro de 2026 às 14:32".
function dataLegivel(quando) {
  return new Date(quando).toLocaleString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Contatos({ contatosIniciais }) {
  // A lista vive na tela. Ao salvar, o contato novo entra aqui na hora,
  // sem recarregar a página.
  const [contatos, setContatos] = useState(contatosIniciais);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  // Qual contato está com as anotações abertas. Só um por vez.
  const [contatoAberto, setContatoAberto] = useState(null);

  async function aoEnviar(evento) {
    evento.preventDefault();
    setErro("");
    setSalvando(true);

    const resultado = await criarContato({ nome, email, telefone });

    setSalvando(false);

    if (!resultado.ok) {
      setErro(resultado.erro);
      return;
    }

    setContatos([resultado.contato, ...contatos]);
    setNome("");
    setEmail("");
    setTelefone("");
  }

  return (
    <>
      <Painel contatos={contatos} />

      <section className="cartao">
        <h2>Novo contato</h2>

        {/* noValidate: quem avisa do nome vazio é a nossa mensagem, não o navegador. */}
        <form className="formulario" onSubmit={aoEnviar} noValidate>
          <div className="campos">
            <label className="campo">
              <span>Nome</span>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ana Ribeiro"
              />
            </label>

            <label className="campo">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ana@exemplo.com.br"
              />
            </label>

            <label className="campo">
              <span>Telefone</span>
              <input
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(11) 98888-1234"
              />
            </label>
          </div>

          {erro && <p className="erro">{erro}</p>}

          <button className="botao" type="submit" disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar contato"}
          </button>
        </form>
      </section>

      <section className="bloco-lista">
        <h2 className="titulo-lista">Contatos</h2>

        {contatos.length === 0 ? (
          <p className="vazio">Nenhum contato cadastrado ainda.</p>
        ) : (
          <ul className="lista">
            {contatos.map((contato) => {
              const aberto = contatoAberto === contato.id;

              return (
                <li key={contato.id} className="item">
                  <button
                    type="button"
                    className="linha"
                    aria-expanded={aberto}
                    onClick={() => setContatoAberto(aberto ? null : contato.id)}
                  >
                    <div className="dados">
                      <strong className="nome">{contato.nome}</strong>
                      <span className="apoio">{contato.email || "—"}</span>
                      <span className="apoio">{contato.telefone || "—"}</span>
                    </div>
                    <div className="fim-da-linha">
                      <span
                        className={`etiqueta etapa-${contato.etapa.replace(/[\s_]+/g, "-")}`}
                      >
                        {contato.etapa}
                      </span>
                      <span className="seta" aria-hidden="true">
                        {aberto ? "Fechar" : "Anotações"}
                      </span>
                    </div>
                  </button>

                  {aberto && <Anotacoes contatoId={contato.id} />}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}

// Painel do funil. Conta a partir da mesma lista que a tela já tem na mão,
// então todo cadastro ou mudança de etapa aparece aqui no mesmo instante,
// sem ida extra ao banco.
const ETAPAS = ["novo", "em contato", "proposta", "cliente"];

function Painel({ contatos }) {
  const contagem = {};
  for (const etapa of ETAPAS) {
    contagem[etapa] = contatos.filter((c) => c.etapa === etapa).length;
  }

  return (
    <section className="painel">
      <div className="quadro quadro-total">
        <strong className="numero">{contatos.length}</strong>
        <span className="rotulo">no total</span>
      </div>

      {ETAPAS.map((etapa) => (
        <div key={etapa} className="quadro">
          <strong className="numero">{contagem[etapa]}</strong>
          <span className={`etiqueta etapa-${etapa.replace(/[\s_]+/g, "-")}`}>
            {etapa}
          </span>
        </div>
      ))}
    </section>
  );
}

// Painel de anotações de UM contato. Busca no banco quando abre,
// e cada anotação nova entra na lista na hora.
function Anotacoes({ contatoId }) {
  const [anotacoes, setAnotacoes] = useState(null); // null = ainda carregando
  const [texto, setTexto] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    let cancelado = false;

    listarAnotacoes(contatoId).then((resultado) => {
      if (cancelado) return;
      if (resultado.ok) {
        setAnotacoes(resultado.anotacoes);
      } else {
        setAnotacoes([]);
        setErro(resultado.erro);
      }
    });

    return () => {
      cancelado = true;
    };
  }, [contatoId]);

  async function aoEnviar(evento) {
    evento.preventDefault();
    setErro("");
    setSalvando(true);

    const resultado = await criarAnotacao({ contatoId, texto });

    setSalvando(false);

    if (!resultado.ok) {
      setErro(resultado.erro);
      return;
    }

    setAnotacoes([resultado.anotacao, ...(anotacoes || [])]);
    setTexto("");
  }

  return (
    <div className="anotacoes">
      <form onSubmit={aoEnviar} noValidate>
        <label className="campo">
          <span>Nova anotação</span>
          <textarea
            rows={3}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="O que foi conversado, o que ficou combinado..."
          />
        </label>

        {erro && <p className="erro">{erro}</p>}

        <button className="botao botao-menor" type="submit" disabled={salvando}>
          {salvando ? "Salvando..." : "Salvar anotação"}
        </button>
      </form>

      <FollowUp contatoId={contatoId} />

      {anotacoes === null ? (
        <p className="vazio historico">Carregando anotações...</p>
      ) : anotacoes.length === 0 ? (
        <p className="vazio historico">Nenhuma anotação para este contato ainda.</p>
      ) : (
        <ul className="historico">
          {anotacoes.map((anotacao) => (
            <ItemAnotacao
              key={anotacao.id}
              anotacao={anotacao}
              aoEditar={(alterada) =>
                setAnotacoes(
                  anotacoes.map((a) => (a.id === alterada.id ? alterada : a))
                )
              }
              aoExcluir={(id) =>
                setAnotacoes(anotacoes.filter((a) => a.id !== id))
              }
            />
          ))}
        </ul>
      )}
    </div>
  );
}

// Mensagem de acompanhamento escrita pela IA a partir das anotações e da
// etapa do contato. Quem escreve é o servidor: a chave da IA não pode passar
// pelo navegador. A mensagem não é guardada no banco — é um rascunho para
// copiar, ajustar e enviar por fora.
function FollowUp({ contatoId }) {
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [escrevendo, setEscrevendo] = useState(false);
  const [copiado, setCopiado] = useState(false);

  async function gerar() {
    setErro("");
    setCopiado(false);
    setEscrevendo(true);

    const resultado = await gerarFollowUp(contatoId);

    setEscrevendo(false);

    if (!resultado.ok) {
      setErro(resultado.erro);
      return;
    }

    setMensagem(resultado.mensagem);
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(mensagem);
      setCopiado(true);
    } catch {
      setErro("Não foi possível copiar. Selecione o texto e copie na mão.");
    }
  }

  return (
    <div className="follow-up">
      <button
        type="button"
        className="botao botao-menor"
        onClick={gerar}
        disabled={escrevendo}
      >
        {escrevendo
          ? "Escrevendo..."
          : mensagem
            ? "Gerar outro follow-up"
            : "Gerar follow-up"}
      </button>

      {erro && <p className="erro">{erro}</p>}

      {mensagem && !escrevendo && (
        <div className="mensagem-gerada">
          <p className="texto-anotacao">{mensagem}</p>
          <div className="acoes-da-anotacao">
            <button type="button" className="link-acao" onClick={copiar}>
              {copiado ? "Copiado" : "Copiar mensagem"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Uma anotação da lista. Ela tem três estados: lendo (o normal),
// editando (o texto vira campo) e confirmando (antes de excluir de vez).
function ItemAnotacao({ anotacao, aoEditar, aoExcluir }) {
  const [modo, setModo] = useState("lendo");
  const [rascunho, setRascunho] = useState(anotacao.texto);
  const [erro, setErro] = useState("");
  const [ocupado, setOcupado] = useState(false);

  async function salvarEdicao() {
    setErro("");
    setOcupado(true);

    const resultado = await editarAnotacao({ id: anotacao.id, texto: rascunho });

    setOcupado(false);

    if (!resultado.ok) {
      setErro(resultado.erro);
      return;
    }

    aoEditar(resultado.anotacao);
    setModo("lendo");
  }

  async function excluir() {
    setErro("");
    setOcupado(true);

    const resultado = await excluirAnotacao(anotacao.id);

    if (!resultado.ok) {
      setOcupado(false);
      setErro(resultado.erro);
      return;
    }

    aoExcluir(anotacao.id);
  }

  return (
    <li className="anotacao">
      <time className="data" dateTime={anotacao.criado_em}>
        {dataLegivel(anotacao.criado_em)}
      </time>

      {modo === "editando" ? (
        <>
          <textarea
            rows={3}
            value={rascunho}
            onChange={(e) => setRascunho(e.target.value)}
          />
          {erro && <p className="erro">{erro}</p>}
          <div className="acoes-da-anotacao">
            <button
              type="button"
              className="botao botao-menor"
              onClick={salvarEdicao}
              disabled={ocupado}
            >
              {ocupado ? "Salvando..." : "Salvar alteração"}
            </button>
            <button
              type="button"
              className="link-acao"
              onClick={() => {
                setRascunho(anotacao.texto);
                setErro("");
                setModo("lendo");
              }}
              disabled={ocupado}
            >
              Cancelar
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="texto-anotacao">{anotacao.texto}</p>
          {erro && <p className="erro">{erro}</p>}

          {modo === "confirmando" ? (
            <div className="acoes-da-anotacao">
              <span className="aviso">Excluir esta anotação de vez?</span>
              <button
                type="button"
                className="link-acao perigo"
                onClick={excluir}
                disabled={ocupado}
              >
                {ocupado ? "Excluindo..." : "Sim, excluir"}
              </button>
              <button
                type="button"
                className="link-acao"
                onClick={() => setModo("lendo")}
                disabled={ocupado}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div className="acoes-da-anotacao">
              <button
                type="button"
                className="link-acao"
                onClick={() => {
                  setRascunho(anotacao.texto);
                  setModo("editando");
                }}
              >
                Editar
              </button>
              <button
                type="button"
                className="link-acao perigo"
                onClick={() => setModo("confirmando")}
              >
                Excluir
              </button>
            </div>
          )}
        </>
      )}
    </li>
  );
}
