// Datas em português, do jeito que aparecem na tela.
// Fica aqui porque o Kanban e a página do contato usam as mesmas.

// "1 de setembro de 2026 às 14:32".
export function dataLegivel(quando) {
  return new Date(quando).toLocaleString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// "há quanto tempo", em dias, meses ou anos. Sem precisão de relógio de
// propósito: o que interessa é se é de hoje ou de três meses atrás.
export function tempoDesde(quando) {
  const dias = Math.floor((Date.now() - new Date(quando)) / 86400000);

  if (dias <= 0) return "hoje";
  if (dias === 1) return "há 1 dia";
  if (dias < 30) return `há ${dias} dias`;

  const meses = Math.floor(dias / 30);
  if (meses === 1) return "há 1 mês";
  if (meses < 12) return `há ${meses} meses`;

  const anos = Math.floor(meses / 12);
  return anos === 1 ? "há 1 ano" : `há ${anos} anos`;
}
