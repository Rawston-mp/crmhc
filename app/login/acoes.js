"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { NOME_DO_COOKIE, criarSessao, senhaConfere } from "../../lib/sessao";
import { usuarioAtual } from "../../lib/autenticacao";

const MENSAGEM_DE_ERRO = "Usuário ou senha inválidos.";

// Os mesmos limites do cadastro. Não são só capricho: o senhaConfere embaralha
// a senha com scrypt, que é lento de propósito, e o custo cresce com o tamanho
// do que foi digitado. Sem um teto, qualquer um poderia mandar uma "senha" de
// megabytes pela tela de login — que é pública — e ocupar o servidor de graça.
const LIMITE = { usuario: 40, senha: 200 };

export async function entrar({ usuario, senha }) {
  const nome = (usuario || "").trim();

  if (!nome || !senha) {
    return { ok: false, erro: MENSAGEM_DE_ERRO };
  }

  // Passou do limite: nem chega a consultar o banco nem a embaralhar. A
  // mensagem é a mesma das outras falhas, para não contar nada a quem tenta.
  if (nome.length > LIMITE.usuario || String(senha).length > LIMITE.senha) {
    return { ok: false, erro: MENSAGEM_DE_ERRO };
  }

  if (!process.env.SESSAO_SEGREDO) {
    // O que falta fica no terminal, para quem cuida do sistema. A tela de login
    // é pública: contar ali qual variável falta é entregar mapa da casa.
    console.error("Falta SESSAO_SEGREDO no .env.local — ninguém consegue entrar.");
    return { ok: false, erro: MENSAGEM_DE_ERRO };
  }

  const { data: pessoa } = await supabase
    .from("usuarios")
    .select("id, senha_hash, situacao")
    .eq("usuario", nome)
    .single();

  // A mesma mensagem para usuário inexistente e senha errada: dizer qual dos
  // dois falhou entregaria metade da resposta a quem tenta invadir.
  if (!pessoa || !senhaConfere(senha, pessoa.senha_hash)) {
    return { ok: false, erro: MENSAGEM_DE_ERRO };
  }

  if (pessoa.situacao !== "aprovado") {
    return {
      ok: false,
      erro: "Seu cadastro ainda está aguardando aprovação do administrador.",
    };
  }

  const sessao = criarSessao(pessoa.id, process.env.SESSAO_SEGREDO);
  const potes = await cookies();

  potes.set(NOME_DO_COOKIE, sessao.valor, {
    // httpOnly: nem o JavaScript da página consegue ler este cookie.
    httpOnly: true,
    sameSite: "lax",
    // Só exige HTTPS quando estiver publicado; em desenvolvimento é http.
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessao.duracaoEmSegundos,
  });

  return { ok: true };
}

export async function sair() {
  const potes = await cookies();
  potes.delete(NOME_DO_COOKIE);
  redirect("/login");
}

// Usada pelas telas públicas: quem já está logado não precisa vê-las.
export async function jaEstaLogado() {
  return (await usuarioAtual()) !== null;
}
