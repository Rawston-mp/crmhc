// As quatro etapas do funil (prd.md), na ordem em que a negociação anda.
// Fica aqui, e não dentro das ações, porque o servidor e a tela usam a mesma
// lista: o servidor para recusar etapa inventada, a tela para montar a escolha.
export const ETAPAS = ["novo", "em contato", "proposta", "cliente"];

// A etapa vira classe CSS: "em contato" -> "etapa-em-contato".
export function classeDaEtapa(etapa) {
  return `etapa-${etapa.replace(/[\s_]+/g, "-")}`;
}
