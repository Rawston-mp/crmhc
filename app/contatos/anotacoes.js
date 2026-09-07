"use client";

import { useEffect, useState } from "react";
import {
  criarAnotacao,
  editarAnotacao,
  excluirAnotacao,
  listarAnotacoes,
} from "../acoes";

import { dataLegivel } from "../../lib/tempo";

// As anotações de um contato: ler, escrever, editar e excluir.
// Usadas pela página do contato.

// Painel de anotações de UM contato. Busca no banco quando abre,
// e cada anotação nova entra na lista na hora.
export default function Anotacoes({ contatoId }) {
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
