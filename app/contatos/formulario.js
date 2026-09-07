"use client";

import Link from "next/link";
import { useState } from "react";
import { criarContato } from "../acoes";

// `aoSalvar` é opcional. Sem ele (área Contatos), o formulário avisa na própria
// tela que salvou. Com ele (o cadastro por cima do Kanban), entrega o contato
// salvo a quem chamou e deixa essa tela decidir o que fazer.
export default function Formulario({ aoSalvar }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  // Nome do último contato salvo, só para confirmar na tela que deu certo.
  const [salvo, setSalvo] = useState("");

  async function aoEnviar(evento) {
    evento.preventDefault();
    setErro("");
    setSalvo("");
    setSalvando(true);

    const resultado = await criarContato({ nome, email, telefone });

    setSalvando(false);

    if (!resultado.ok) {
      setErro(resultado.erro);
      return;
    }

    setNome("");
    setEmail("");
    setTelefone("");

    if (aoSalvar) {
      aoSalvar(resultado.contato);
      return;
    }

    setSalvo(resultado.contato.nome);
  }

  return (
    // noValidate: quem avisa do nome vazio é a nossa mensagem, não o navegador.
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

      {salvo && (
        <p className="aviso-bom">
          {salvo} entrou no funil. <Link href="/funil">Ver no funil</Link>
        </p>
      )}

      <button className="botao" type="submit" disabled={salvando}>
        {salvando ? "Salvando..." : "Salvar contato"}
      </button>
    </form>
  );
}
