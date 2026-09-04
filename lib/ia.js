import Anthropic from "@anthropic-ai/sdk";

// Escreve o follow-up de um contato usando o Claude.
//
// Este arquivo só roda no servidor: a chave da Anthropic nunca pode chegar ao
// navegador. Mesma regra do lib/supabase.js.

const MODELO = "claude-sonnet-4-6";

// O "system" é a instrução fixa: quem a IA é e como ela deve escrever.
// Fica separado da conversa porque não muda de contato para contato.
const INSTRUCAO = `Você escreve mensagens de acompanhamento (follow-up) para um
profissional que usa um CRM. Ele vai ler, ajustar se quiser, e enviar por conta
própria — por WhatsApp, e-mail ou telefone.

Como escrever:
- Português do Brasil, tom profissional, caloroso e direto.
- Curto: de duas a quatro frases. Nada de textão.
- Puxe algo concreto das anotações. Se elas dizem que ficou de mandar uma
  proposta, fale da proposta; se ficou de retomar depois de uma data, fale disso.
- Escreva para a etapa em que a pessoa está: quem é "novo" ainda está sendo
  apresentado ao trabalho; quem está em "proposta" já recebeu números.
- Termine com uma pergunta ou um próximo passo claro.

O que não fazer:
- Não invente fato, preço, prazo ou combinação que não esteja nas anotações.
- Cuidado com o tempo: compare a data de cada anotação com a data de hoje antes
  de dizer "ontem", "semana passada" ou coisa parecida. Na dúvida, não datar.
- Nada de "espero que esteja tudo bem", "venho por meio desta" ou abertura de
  robô. Comece pelo assunto.
- Sem emojis, sem exagero de entusiasmo, sem elogio vazio.

Responda apenas com a mensagem, pronta para copiar e colar. Sem título, sem
aspas em volta, sem explicação do que você fez.`;

// Cliente criado na primeira chamada — não no carregamento do arquivo — para
// que o resto do sistema continue de pé se a chave ainda não foi colada.
let cliente = null;

function pegarCliente() {
  if (!cliente) {
    cliente = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return cliente;
}

export async function escreverFollowUp({ nome, etapa, anotacoes }) {
  const historico = anotacoes
    .map((a) => `- ${new Date(a.criado_em).toLocaleDateString("pt-BR")}: ${a.texto}`)
    .join("\n");

  const resposta = await pegarCliente().messages.create({
    model: MODELO,
    max_tokens: 1000,
    system: INSTRUCAO,
    messages: [
      {
        role: "user",
        content: `Hoje é ${new Date().toLocaleDateString("pt-BR", { dateStyle: "long" })}.

Contato: ${nome}
Etapa do funil: ${etapa}

Anotações, da mais recente para a mais antiga:
${historico}

Escreva a mensagem de acompanhamento para ${nome}.`,
      },
    ],
  });

  // A resposta vem em blocos; junta os de texto e ignora o resto.
  return resposta.content
    .filter((bloco) => bloco.type === "text")
    .map((bloco) => bloco.text)
    .join("")
    .trim();
}
