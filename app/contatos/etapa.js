"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { mudarEtapa } from "../acoes";
import { ETAPAS, classeDaEtapa } from "../../lib/etapas";

// A etapa do contato, trocável na própria página. Igual à do Kanban: a
// etiqueta é a escolha. Se a gravação falhar, a etiqueta volta ao que era.
export default function Etapa({ contatoId, nome, etapaInicial }) {
  const router = useRouter();
  const [etapa, setEtapa] = useState(etapaInicial);
  const [erro, setErro] = useState("");
  const [gravando, setGravando] = useState(false);

  async function escolher(nova) {
    const anterior = etapa;

    setErro("");
    setGravando(true);
    setEtapa(nova);

    const resultado = await mudarEtapa({ id: contatoId, etapa: nova });

    setGravando(false);

    if (!resultado.ok) {
      setEtapa(anterior);
      setErro(resultado.erro);
      return;
    }

    // A ação já mandou o servidor recontar o Kanban e o Dashboard. Isto joga
    // fora o que o navegador guardou dessas telas, para elas virem atualizadas
    // quando a pessoa for até lá — sem precisar recarregar nada na mão.
    router.refresh();
  }

  return (
    <span className={`seletor-de-etapa ${classeDaEtapa(etapa)}`}>
      <select
        className="etiqueta"
        value={etapa}
        disabled={gravando}
        aria-label={`Etapa de ${nome}`}
        onChange={(e) => escolher(e.target.value)}
      >
        {ETAPAS.map((opcao) => (
          <option key={opcao} value={opcao}>
            {opcao}
          </option>
        ))}
      </select>
      {erro && <span className="erro-curto">{erro}</span>}
    </span>
  );
}
