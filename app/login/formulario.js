"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { entrar } from "./acoes";

export default function Formulario() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [entrando, setEntrando] = useState(false);

  async function aoEnviar(evento) {
    evento.preventDefault();
    setErro("");
    setEntrando(true);

    const resultado = await entrar({ usuario, senha });

    if (!resultado.ok) {
      setEntrando(false);
      setErro(resultado.erro);
      return;
    }

    // O cookie já foi criado; agora é só ir para o CRM.
    router.replace("/");
    router.refresh();
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
          autoComplete="current-password"
        />
      </label>

      {erro && <p className="erro">{erro}</p>}

      <button className="botao botao-largo" type="submit" disabled={entrando}>
        {entrando ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
