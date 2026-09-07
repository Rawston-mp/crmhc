"use client";

import Link from "next/link";
import { useState } from "react";
import { classeDaEtapa } from "../../lib/etapas";

// Busca por nome ou email. A lista inteira já vem do servidor com a página, e
// o filtro acontece aqui na tela: para um CRM pessoal, com dezenas de
// contatos, isso é instantâneo e dispensa uma ida ao banco a cada tecla.
export default function Busca({ contatos }) {
  const [termo, setTermo] = useState("");

  const procurado = termo.trim().toLowerCase();

  const achados = procurado
    ? contatos.filter(
        (c) =>
          c.nome.toLowerCase().includes(procurado) ||
          (c.email || "").toLowerCase().includes(procurado)
      )
    : contatos;

  return (
    <>
      <label className="campo campo-de-busca">
        <span>Buscar por nome ou email</span>
        <input
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          placeholder="ana"
          autoComplete="off"
        />
      </label>

      {achados.length === 0 ? (
        <p className="vazio">
          {contatos.length === 0
            ? "Nenhum contato cadastrado ainda."
            : "Nenhum contato com esse nome ou email."}
        </p>
      ) : (
        <ul className="lista">
          {achados.map((contato) => (
            <li key={contato.id} className="item">
              <Link className="linha-do-contato" href={`/contatos/${contato.id}`}>
                <span className="dados-do-achado">
                  <strong className="nome">{contato.nome}</strong>
                  <span className="apoio">{contato.email || "—"}</span>
                </span>
                <span className={`etiqueta ${classeDaEtapa(contato.etapa)}`}>
                  {contato.etapa}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
