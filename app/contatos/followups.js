"use client";

import { useEffect, useState } from "react";
import { gerarFollowUp, listarFollowUps } from "../acoes";
import { dataLegivel } from "../../lib/tempo";

// Os follow-ups escritos pela IA para um contato: o botão que gera um novo e
// a lista dos que já foram escritos. Quem escreve é o servidor — a chave da IA
// nunca chega ao navegador. Cada mensagem fica guardada no banco para reler
// depois; o envio continua sendo por fora, pelo próprio usuário.
export default function FollowUps({ contatoId }) {
  const [followUps, setFollowUps] = useState(null); // null = ainda carregando
  const [erro, setErro] = useState("");
  const [escrevendo, setEscrevendo] = useState(false);

  useEffect(() => {
    let cancelado = false;

    listarFollowUps(contatoId).then((resultado) => {
      if (cancelado) return;
      if (resultado.ok) {
        setFollowUps(resultado.followUps);
      } else {
        setFollowUps([]);
        setErro(resultado.erro);
      }
    });

    return () => {
      cancelado = true;
    };
  }, [contatoId]);

  async function gerar() {
    setErro("");
    setEscrevendo(true);

    const resultado = await gerarFollowUp(contatoId);

    setEscrevendo(false);

    if (!resultado.ok) {
      setErro(resultado.erro);
      return;
    }

    setFollowUps([resultado.followUp, ...(followUps || [])]);
  }

  return (
    <>
      <button
        type="button"
        className="botao botao-menor"
        onClick={gerar}
        disabled={escrevendo}
      >
        {escrevendo ? "Escrevendo..." : "Gerar follow-up"}
      </button>

      {erro && <p className="erro">{erro}</p>}

      {followUps === null ? (
        <p className="vazio historico">Carregando follow-ups...</p>
      ) : followUps.length === 0 ? (
        <p className="vazio historico">
          Nenhum follow-up escrito para este contato ainda.
        </p>
      ) : (
        <ul className="historico">
          {followUps.map((followUp) => (
            <ItemFollowUp key={followUp.id} followUp={followUp} />
          ))}
        </ul>
      )}
    </>
  );
}

function ItemFollowUp({ followUp }) {
  const [copiado, setCopiado] = useState(false);
  const [erro, setErro] = useState("");

  async function copiar() {
    try {
      await navigator.clipboard.writeText(followUp.texto);
      setCopiado(true);
    } catch {
      setErro("Não foi possível copiar. Selecione o texto e copie na mão.");
    }
  }

  return (
    <li className="anotacao">
      <time className="data" dateTime={followUp.criado_em}>
        {dataLegivel(followUp.criado_em)}
      </time>

      <p className="texto-anotacao">{followUp.texto}</p>

      {erro && <p className="erro">{erro}</p>}

      <div className="acoes-da-anotacao">
        <button type="button" className="link-acao" onClick={copiar}>
          {copiado ? "Copiado" : "Copiar mensagem"}
        </button>
      </div>
    </li>
  );
}
