"use server";

import { supabase } from "../../lib/supabase";
import { embaralharSenha } from "../../lib/sessao";

// Nome de acesso: letras, números, ponto, traço e sublinhado. Sem espaço nem
// símbolo, para não existirem dois usuários que parecem o mesmo na tela.
const FORMATO_DO_USUARIO = /^[A-Za-z0-9._-]+$/;

export async function cadastrar({ usuario, senha, confirmacao }) {
  const nome = (usuario || "").trim();

  if (nome.length < 3 || nome.length > 40) {
    return { ok: false, erro: "O usuário precisa ter de 3 a 40 caracteres." };
  }

  if (!FORMATO_DO_USUARIO.test(nome)) {
    return {
      ok: false,
      erro: "O usuário aceita apenas letras, números, ponto, traço e sublinhado.",
    };
  }

  if ((senha || "").length < 8) {
    return { ok: false, erro: "A senha precisa ter pelo menos 8 caracteres." };
  }

  if (senha.length > 200) {
    return { ok: false, erro: "A senha pode ter no máximo 200 caracteres." };
  }

  if (senha !== confirmacao) {
    return { ok: false, erro: "As duas senhas não são iguais." };
  }

  const { error } = await supabase.from("usuarios").insert({
    usuario: nome,
    senha_hash: embaralharSenha(senha),
    // papel e situação ficam no padrão da tabela: usuario / pendente.
  });

  if (error) {
    // 23505 é o código do Postgres para "esse valor já existe".
    if (error.code === "23505") {
      return { ok: false, erro: "Esse usuário já está cadastrado." };
    }
    console.error("Falha ao cadastrar usuário:", error);
    return { ok: false, erro: "Não foi possível cadastrar. Tente de novo." };
  }

  return { ok: true };
}
