"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { mudarEtapa } from "../acoes";
import { ETAPAS, classeDaEtapa } from "../../lib/etapas";
import { tempoDesde } from "../../lib/tempo";
import Formulario from "../contatos/formulario";

export default function Quadro({ contatosIniciais }) {
  const router = useRouter();

  // A lista vive na tela: mover um cartão troca a coluna na hora, sem esperar
  // a página voltar do servidor.
  const [contatos, setContatos] = useState(contatosIniciais);

  // Qual cartão está na mão e sobre qual coluna ele está passando.
  const [arrastando, setArrastando] = useState(null);
  const [colunaAlvo, setColunaAlvo] = useState(null);

  const [erro, setErro] = useState("");
  const [cadastroAberto, setCadastroAberto] = useState(false);

  function trocarEtapa(id, etapa) {
    setContatos((atuais) =>
      atuais.map((c) => (c.id === id ? { ...c, etapa } : c))
    );
  }

  // O id vem do próprio evento de arrastar, que é quem o carrega de verdade.
  // Ler do estado daria errado se o React ainda não tivesse redesenhado entre
  // pegar o cartão e soltá-lo.
  async function soltarNaEtapa(etapa, id) {
    setArrastando(null);
    setColunaAlvo(null);

    const contato = contatos.find((c) => c.id === id);
    if (!contato || contato.etapa === etapa) return;

    const anterior = contato.etapa;

    setErro("");
    trocarEtapa(id, etapa);

    const resultado = await mudarEtapa({ id, etapa });

    // Deu errado: o cartão volta para a coluna de onde saiu. A tela nunca
    // mostra uma etapa que o banco não tem.
    if (!resultado.ok) {
      trocarEtapa(id, anterior);
      setErro(resultado.erro);
    }
  }

  return (
    <>
      <div className="acoes-da-tela">
        <button
          type="button"
          className="botao"
          onClick={() => setCadastroAberto(true)}
        >
          Novo contato
        </button>
      </div>

      {erro && <p className="erro">{erro}</p>}

      <div className="quadro-funil">
        {ETAPAS.map((etapa) => {
          const daColuna = contatos.filter((c) => c.etapa === etapa);

          return (
            <section
              key={etapa}
              className={`coluna${colunaAlvo === etapa ? " coluna-alvo" : ""}`}
              onDragOver={(e) => {
                // Sem o preventDefault o navegador recusa o "soltar" aqui.
                e.preventDefault();
                setColunaAlvo(etapa);
              }}
              onDragLeave={() => setColunaAlvo((atual) => (atual === etapa ? null : atual))}
              onDrop={(e) => {
                e.preventDefault();
                soltarNaEtapa(etapa, e.dataTransfer.getData("text/plain"));
              }}
            >
              <header className="topo-da-coluna">
                <span className={`etiqueta ${classeDaEtapa(etapa)}`}>{etapa}</span>
                <span className="contador">{daColuna.length}</span>
              </header>

              {daColuna.length === 0 ? (
                <p className="coluna-vazia">Nenhum contato aqui.</p>
              ) : (
                <ul className="cartoes">
                  {daColuna.map((contato) => (
                    <li key={contato.id}>
                      <article
                        className={`cartao-contato${
                          arrastando === contato.id ? " em-movimento" : ""
                        }`}
                        role="link"
                        tabIndex={0}
                        // Depois de uma arrastada o navegador não dispara
                        // clique, então abrir o contato no clique não atrapalha
                        // mover o cartão.
                        onClick={() => router.push(`/contatos/${contato.id}`)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            router.push(`/contatos/${contato.id}`);
                          }
                        }}
                        draggable
                        onDragStart={(e) => {
                          // O Firefox só começa a arrastar se algo for escrito
                          // aqui; quem guarda o id de verdade é o estado.
                          e.dataTransfer.setData("text/plain", contato.id);
                          e.dataTransfer.effectAllowed = "move";
                          setArrastando(contato.id);
                        }}
                        onDragEnd={() => {
                          setArrastando(null);
                          setColunaAlvo(null);
                        }}
                      >
                        <strong className="nome-do-cartao">{contato.nome}</strong>
                        <span className="apoio">{contato.email || "—"}</span>
                        <span className="idade-do-cartao">
                          {tempoDesde(contato.criado_em)}
                        </span>
                      </article>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>

      {cadastroAberto && (
        <Cadastro
          aoFechar={() => setCadastroAberto(false)}
          aoSalvar={(contato) => {
            setContatos([contato, ...contatos]);
            setCadastroAberto(false);
          }}
        />
      )}
    </>
  );
}

// O cadastro por cima da tela, para não perder o quadro de vista. O formulário
// é o mesmo da área Contatos — aqui ele só devolve o contato salvo em vez de
// mandar a pessoa para outro lugar.
function Cadastro({ aoFechar, aoSalvar }) {
  useEffect(() => {
    function aoTeclar(evento) {
      if (evento.key === "Escape") aoFechar();
    }

    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [aoFechar]);

  return (
    <div className="fundo-do-modal" onClick={aoFechar}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Novo contato"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="topo-do-modal">
          <h2>Novo contato</h2>
          <button type="button" className="link-acao" onClick={aoFechar}>
            Fechar
          </button>
        </header>

        <Formulario aoSalvar={aoSalvar} />
      </div>
    </div>
  );
}
