import crypto from "node:crypto";

// --- Senha ---
//
// A senha nunca é guardada como texto. Ela passa pelo scrypt, que é um
// "embaralhador" de mão única: dá para transformar a senha no código
// embaralhado, mas não dá para voltar do código embaralhado para a senha.
// Cada senha ganha um "sal" (um punhado de bytes ao acaso) para que duas
// senhas iguais gerem códigos diferentes.

const CUSTO = { N: 16384, r: 8, p: 1 };
const TAMANHO = 64;

function embaralhar(senha, sal) {
  return crypto.scryptSync(senha, sal, TAMANHO, CUSTO);
}

// Formato guardado no .env.local: scrypt:<sal>:<embaralhado>
// Separado por ":" de propósito: o leitor de .env trata "$" como início de
// nome de variável e comeria metade do valor pelo caminho.
export function embaralharSenha(senha) {
  const sal = crypto.randomBytes(16).toString("hex");
  return `scrypt:${sal}:${embaralhar(senha, sal).toString("hex")}`;
}

export function senhaConfere(senha, guardado) {
  const partes = String(guardado || "").split(":");
  if (partes.length !== 3 || partes[0] !== "scrypt") return false;

  const [, sal, esperado] = partes;
  const esperadoBytes = Buffer.from(esperado, "hex");
  if (esperadoBytes.length !== TAMANHO) return false;

  // timingSafeEqual compara sempre no mesmo tempo, para não entregar pistas
  // a quem tentasse adivinhar a senha medindo a demora da resposta.
  return crypto.timingSafeEqual(embaralhar(senha, sal), esperadoBytes);
}

// --- Cookie de sessão ---
//
// O cookie não guarda a senha: guarda só uma data de validade com uma
// assinatura. A assinatura é feita com um segredo que só o servidor conhece,
// então ninguém consegue forjar um cookie válido por fora.

export const NOME_DO_COOKIE = "sessao";
const DURACAO_EM_HORAS = 8;

function assinar(conteudo, segredo) {
  return crypto.createHmac("sha256", segredo).update(conteudo).digest("hex");
}

// O cookie guarda quem entrou e até quando vale: <id>.<validade>.<assinatura>
export function criarSessao(usuarioId, segredo) {
  const expiraEm = String(Date.now() + DURACAO_EM_HORAS * 60 * 60 * 1000);
  const conteudo = `${usuarioId}.${expiraEm}`;
  return {
    valor: `${conteudo}.${assinar(conteudo, segredo)}`,
    duracaoEmSegundos: DURACAO_EM_HORAS * 60 * 60,
  };
}

// Devolve o id de quem está na sessão, ou null se o cookie não presta.
// O id só é aceito depois de a assinatura bater: quem mexer no cookie para
// se passar por outra pessoa derruba a assinatura e não entra.
export function idDaSessao(valor, segredo) {
  const partes = String(valor || "").split(".");
  if (partes.length !== 3) return null;

  const [id, expiraEm, assinatura] = partes;
  const esperada = assinar(`${id}.${expiraEm}`, segredo);
  if (assinatura.length !== esperada.length) return null;

  const confere = crypto.timingSafeEqual(
    Buffer.from(assinatura),
    Buffer.from(esperada)
  );

  if (!confere || Number(expiraEm) <= Date.now()) return null;

  return id;
}

export function sessaoValida(valor, segredo) {
  return idDaSessao(valor, segredo) !== null;
}
