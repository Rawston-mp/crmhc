"use client";

import Link from "next/link";
import { useState } from "react";
import { cadastrar } from "./acoes";

export default function Formulario() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [pronto, setPronto] = useState(false);

  async function aoEnviar(evento) {
    evento.preventDefault();
    setErro("");
    setEnviando(true);

    const resultado = await cadastrar({ usuario, senha, confirmacao });

    setEnviando(false);

    if (!resultado.ok) {
      setErro(resultado.erro);
      return;
    }

    setPronto(true);
  }

  if (pronto) {
    return (
      <div>
        <p className="aviso-bom">
          Cadastro enviado. Ele precisa ser aprovado pelo administrador antes de
          você conseguir entrar.
        </p>
        <p className="rodape-do-cartao">
          <Link href="/login">Voltar para o login</Link>
        </p>
      </div>
    );
  }

  return (
    <form className="formulario" onSubmit={aoEnviar} noValidate>
      <label className="campo">
        <span>Usuário</span>
        <input
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          autoComplete="username"
          autoFocus
        />
      </label>

      <label className="campo campo-espacado">
        <span>Senha</span>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          autoComplete="new-password"
        />
      </label>

      <label className="campo campo-espacado">
        <span>Repita a senha</span>
        <input
          type="password"
          value={confirmacao}
          onChange={(e) => setConfirmacao(e.target.value)}
          autoComplete="new-password"
        />
      </label>

      {erro && <p className="erro">{erro}</p>}

      <button className="botao botao-largo" type="submit" disabled={enviando}>
        {enviando ? "Enviando..." : "Criar acesso"}
      </button>
    </form>
  );
}
