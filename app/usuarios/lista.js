"use client";

import { useState } from "react";
import { aprovarUsuario, reprovarUsuario } from "./acoes";

function dataLegivel(quando) {
  return new Date(quando).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function Lista({ usuarios, meuId }) {
  const [erro, setErro] = useState("");
  const [ocupado, setOcupado] = useState(null);

  async function agir(id, acao) {
    setErro("");
    setOcupado(id);

    const resultado = await acao(id);

    setOcupado(null);

    if (!resultado.ok) setErro(resultado.erro);
    // Deu certo: o servidor recarrega a lista sozinho (revalidatePath).
  }

  const pendentes = usuarios.filter((u) => u.situacao === "pendente");
  const aprovados = usuarios.filter((u) => u.situacao === "aprovado");

  return (
    <>
      <section>
        <h2 className="titulo-lista">Aguardando aprovação</h2>

        {erro && <p className="erro">{erro}</p>}

        {pendentes.length === 0 ? (
          <p className="vazio">Nenhum cadastro esperando.</p>
        ) : (
          <ul className="lista">
            {pendentes.map((pessoa) => (
              <li key={pessoa.id} className="item linha-usuario">
                <div className="dados-usuario">
                  <strong className="nome">{pessoa.usuario}</strong>
                  <span className="apoio">
                    cadastrou-se em {dataLegivel(pessoa.criado_em)}
                  </span>
                </div>
                <button
                  type="button"
                  className="botao botao-menor"
                  disabled={ocupado === pessoa.id}
                  onClick={() => agir(pessoa.id, aprovarUsuario)}
                >
                  {ocupado === pessoa.id ? "Aprovando..." : "Aprovar"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bloco-lista">
        <h2 className="titulo-lista">Com acesso</h2>

        <ul className="lista">
          {aprovados.map((pessoa) => (
            <li key={pessoa.id} className="item linha-usuario">
              <div className="dados-usuario">
                <strong className="nome">
                  {pessoa.usuario}
                  {pessoa.id === meuId && <span className="apoio"> (você)</span>}
                </strong>
                <span className="apoio">
                  {pessoa.papel === "admin" ? "administrador" : "usuário"}
                </span>
              </div>

              {pessoa.id === meuId ? (
                <span className="apoio">—</span>
              ) : (
                <button
                  type="button"
                  className="link-acao perigo"
                  disabled={ocupado === pessoa.id}
                  onClick={() => agir(pessoa.id, reprovarUsuario)}
                >
                  {ocupado === pessoa.id ? "Removendo..." : "Remover acesso"}
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
