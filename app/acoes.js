"use server";

import Anthropic from "@anthropic-ai/sdk";

import { supabase } from "../lib/supabase";
import { usuarioAtual } from "../lib/autenticacao";
import { escreverFollowUp } from "../lib/ia";

// Ações de servidor: rodam SÓ no servidor, mesmo sendo chamadas pela tela.
// É assim que a chave secreta do banco nunca chega ao navegador.

// Toda ação daqui começa por esta porta. O porteiro do middleware confere só a
// assinatura do cookie; aqui a gente confere se a pessoa ainda existe e ainda
// está aprovada — e isso vale mesmo se a ação for chamada por fora da tela.
async function semSessao() {
  if (await usuarioAtual()) return null;
  return { ok: false, erro: "Sua sessão expirou. Entre de novo para continuar." };
}

// Os ids do banco são UUID. Recusar o que não tem essa cara evita mandar lixo
// para o Postgres e receber de volta um erro técnico.
const FORMATO_DE_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const LIMITE = { nome: 120, email: 200, anotacao: 5000 };

// Um e-mail plausível: algo, arroba, algo, ponto, algo. Sem regra elaborada —
// a prova real de que um e-mail existe é mandar mensagem para ele.
const FORMATO_DE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Telefone brasileiro: DDD (11 a 99) + 8 dígitos (fixo) ou 9 dígitos começando
// com 9 (celular). Aceita o que a pessoa digitar com parênteses, espaço ou
// traço, e guarda sempre no mesmo formato: (11) 98888-1234.
function arrumarTelefone(telefone) {
  const digitos = (telefone || "").replace(/\D/g, "");

  if (!digitos) {
    return { ok: true, valor: null };
  }

  const ddd = digitos.slice(0, 2);
  const numero = digitos.slice(2);

  const dddValido = Number(ddd) >= 11;
  const fixo = numero.length === 8;
  const celular = numero.length === 9 && numero.startsWith("9");

  if (!dddValido || !(fixo || celular)) {
    return {
      ok: false,
      erro:
        "Telefone inválido. Use DDD + número: (11) 98888-1234 ou (11) 3888-1234.",
    };
  }

  const meio = numero.slice(0, numero.length - 4);
  const fim = numero.slice(-4);
  return { ok: true, valor: `(${ddd}) ${meio}-${fim}` };
}

export async function criarContato({ nome, email, telefone }) {
  const barrado = await semSessao();
  if (barrado) return barrado;

  const nomeLimpo = (nome || "").trim();
  const emailLimpo = (email || "").trim();

  // Regra de negócio: contato sem nome não existe.
  if (!nomeLimpo) {
    return { ok: false, erro: "Informe o nome do contato para salvar." };
  }

  if (nomeLimpo.length > LIMITE.nome) {
    return { ok: false, erro: `O nome pode ter no máximo ${LIMITE.nome} caracteres.` };
  }

  if (emailLimpo && emailLimpo.length > LIMITE.email) {
    return { ok: false, erro: `O email pode ter no máximo ${LIMITE.email} caracteres.` };
  }

  if (emailLimpo && !FORMATO_DE_EMAIL.test(emailLimpo)) {
    return { ok: false, erro: "Email inválido. Use o formato nome@exemplo.com.br." };
  }

  const telefoneArrumado = arrumarTelefone(telefone);
  if (!telefoneArrumado.ok) {
    return { ok: false, erro: telefoneArrumado.erro };
  }

  const { data, error } = await supabase
    .from("contatos")
    .insert({
      nome: nomeLimpo,
      email: emailLimpo || null,
      telefone: telefoneArrumado.valor,
      etapa: "novo",
    })
    .select()
    .single();

  if (error) {
    console.error("Falha ao salvar contato:", error);
    return { ok: false, erro: "Não foi possível salvar. Tente de novo." };
  }

  return { ok: true, contato: data };
}

// --- Anotações ---

export async function listarAnotacoes(contatoId) {
  const barrado = await semSessao();
  if (barrado) return barrado;

  if (!FORMATO_DE_ID.test(contatoId || "")) {
    return { ok: false, erro: "Não foi possível carregar as anotações." };
  }

  const { data, error } = await supabase
    .from("anotacoes")
    .select("id, texto, criado_em")
    .eq("contato_id", contatoId)
    .order("criado_em", { ascending: false });

  if (error) {
    console.error("Falha ao carregar anotações:", error);
    return { ok: false, erro: "Não foi possível carregar as anotações." };
  }

  return { ok: true, anotacoes: data };
}

export async function criarAnotacao({ contatoId, texto }) {
  const barrado = await semSessao();
  if (barrado) return barrado;

  const textoLimpo = (texto || "").trim();

  if (!textoLimpo) {
    return { ok: false, erro: "Escreva a anotação antes de salvar." };
  }

  if (textoLimpo.length > LIMITE.anotacao) {
    return {
      ok: false,
      erro: `A anotação pode ter no máximo ${LIMITE.anotacao} caracteres.`,
    };
  }

  if (!FORMATO_DE_ID.test(contatoId || "")) {
    return { ok: false, erro: "Não foi possível salvar a anotação. Tente de novo." };
  }

  const { data, error } = await supabase
    .from("anotacoes")
    .insert({ contato_id: contatoId, texto: textoLimpo })
    .select("id, texto, criado_em")
    .single();

  if (error) {
    console.error("Falha ao salvar anotação:", error);
    return { ok: false, erro: "Não foi possível salvar a anotação. Tente de novo." };
  }

  return { ok: true, anotacao: data };
}

export async function editarAnotacao({ id, texto }) {
  const barrado = await semSessao();
  if (barrado) return barrado;

  const textoLimpo = (texto || "").trim();

  if (!textoLimpo) {
    return { ok: false, erro: "A anotação não pode ficar vazia." };
  }

  if (textoLimpo.length > LIMITE.anotacao) {
    return {
      ok: false,
      erro: `A anotação pode ter no máximo ${LIMITE.anotacao} caracteres.`,
    };
  }

  if (!FORMATO_DE_ID.test(id || "")) {
    return { ok: false, erro: "Não foi possível salvar a alteração. Tente de novo." };
  }

  const { data, error } = await supabase
    .from("anotacoes")
    .update({ texto: textoLimpo })
    .eq("id", id)
    .select("id, texto, criado_em")
    .single();

  if (error) {
    console.error("Falha ao editar anotação:", error);
    return { ok: false, erro: "Não foi possível salvar a alteração. Tente de novo." };
  }

  return { ok: true, anotacao: data };
}

export async function excluirAnotacao(id) {
  const barrado = await semSessao();
  if (barrado) return barrado;

  if (!FORMATO_DE_ID.test(id || "")) {
    return { ok: false, erro: "Não foi possível excluir a anotação. Tente de novo." };
  }

  const { error } = await supabase.from("anotacoes").delete().eq("id", id);

  if (error) {
    console.error("Falha ao excluir anotação:", error);
    return { ok: false, erro: "Não foi possível excluir a anotação. Tente de novo." };
  }

  return { ok: true };
}

// --- Follow-up escrito por IA ---

// Roda no servidor de propósito: a chave da Anthropic fica aqui e nunca é
// enviada ao navegador, onde qualquer visitante poderia lê-la e gastá-la.
export async function gerarFollowUp(contatoId) {
  const barrado = await semSessao();
  if (barrado) return barrado;

  if (!FORMATO_DE_ID.test(contatoId || "")) {
    return { ok: false, erro: "Contato não encontrado." };
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      ok: false,
      erro: "O gerador de follow-up ainda não foi configurado. Falta a chave da IA.",
    };
  }

  const { data: contato } = await supabase
    .from("contatos")
    .select("nome, etapa")
    .eq("id", contatoId)
    .single();

  if (!contato) {
    return { ok: false, erro: "Contato não encontrado." };
  }

  const { data: anotacoes } = await supabase
    .from("anotacoes")
    .select("texto, criado_em")
    .eq("contato_id", contatoId)
    .order("criado_em", { ascending: false })
    .limit(20);

  // Sem anotações não há história para a IA usar, e o texto sairia genérico.
  if (!anotacoes || anotacoes.length === 0) {
    return {
      ok: false,
      erro: "Escreva ao menos uma anotação sobre este contato antes de gerar o follow-up.",
    };
  }

  try {
    const mensagem = await escreverFollowUp({
      nome: contato.nome,
      etapa: contato.etapa,
      anotacoes,
    });

    if (!mensagem) {
      return { ok: false, erro: "A IA não conseguiu escrever desta vez. Tente de novo." };
    }

    return { ok: true, mensagem };
  } catch (falha) {
    // O detalhe técnico fica no terminal do servidor, para quem cuida do
    // sistema. Na tela vai só o que ajuda quem está usando.
    console.error("Falha ao gerar follow-up:", falha);

    if (falha instanceof Anthropic.AuthenticationError) {
      return { ok: false, erro: "O gerador de follow-up não está configurado direito." };
    }

    if (falha instanceof Anthropic.RateLimitError) {
      return { ok: false, erro: "A IA está ocupada agora. Espere um instante e tente de novo." };
    }

    if (falha instanceof Anthropic.APIConnectionError) {
      return { ok: false, erro: "Não foi possível falar com a IA. Confira a conexão e tente de novo." };
    }

    return { ok: false, erro: "Não foi possível gerar o follow-up. Tente de novo." };
  }
}
