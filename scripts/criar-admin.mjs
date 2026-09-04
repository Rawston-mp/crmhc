// Cria (ou promove) um administrador direto no banco.
// Rodar com: node scripts/criar-admin.mjs
//
// A senha é digitada aqui no seu terminal e não é gravada em lugar nenhum:
// o que vai para o banco é só o código embaralhado, que não dá para desembaralhar.

import readline from "node:readline";
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";
import { embaralharSenha } from "../lib/sessao.js";

const CTRL_C = "";
const BACKSPACE = "";

// Lê o .env.local na mão: este script roda fora do Next.
for (const linha of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
  const m = linha.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
  if (m) process.env[m[1]] = m[2];
}

const banco = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { persistSession: false } }
);

function perguntar(pergunta) {
  const entrada = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolva) => {
    entrada.question(pergunta, (resposta) => {
      entrada.close();
      resolva(resposta);
    });
  });
}

// Pergunta escondendo o que está sendo digitado, para a senha não ficar na tela.
function perguntarSenha(pergunta) {
  return new Promise((resolva) => {
    process.stdout.write(pergunta);
    process.stdin.setRawMode(true);
    process.stdin.resume();

    let texto = "";

    function aoDigitar(tecla) {
      const c = tecla.toString();

      if (c === "\r" || c === "\n") {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdin.off("data", aoDigitar);
        process.stdout.write("\n");
        resolva(texto);
      } else if (c === CTRL_C) {
        process.stdout.write("\n");
        process.exit(1);
      } else if (c === BACKSPACE || c === "\b") {
        texto = texto.slice(0, -1);
      } else {
        texto += c;
      }
    }

    process.stdin.on("data", aoDigitar);
  });
}

const usuario = (await perguntar("Usuário do administrador: ")).trim();
const senha = await perguntarSenha("Senha: ");
const confirmacao = await perguntarSenha("Repita a senha: ");

if (usuario.length < 3) {
  console.error("\nO usuário precisa ter pelo menos 3 caracteres.");
  process.exit(1);
}

if (senha.length < 8) {
  console.error("\nA senha precisa ter pelo menos 8 caracteres.");
  process.exit(1);
}

if (senha !== confirmacao) {
  console.error("\nAs duas senhas não são iguais. Rode de novo.");
  process.exit(1);
}

// Se já existir alguém com esse nome, atualiza; senão, cria.
const { data: existente } = await banco
  .from("usuarios")
  .select("id")
  .eq("usuario", usuario)
  .maybeSingle();

const dados = {
  usuario,
  senha_hash: embaralharSenha(senha),
  papel: "admin",
  situacao: "aprovado",
};

const { error } = existente
  ? await banco.from("usuarios").update(dados).eq("id", existente.id)
  : await banco.from("usuarios").insert(dados);

if (error) {
  console.error("\nDeu errado:", error.message);
  process.exit(1);
}

console.log(
  `\nPronto. "${usuario}" agora é administrador e já pode entrar em /login.`
);
