import Link from "next/link";

import { supabase } from "../lib/supabase";
import { exigirUsuario } from "../lib/autenticacao";
import { ETAPAS, classeDaEtapa } from "../lib/etapas";
import { tempoDesde } from "../lib/tempo";
import Shell from "./shell";

// Esta página roda no servidor e não guarda cópia: a cada abertura ela conta
// de novo. É por isso que mudar uma etapa no Kanban aparece aqui sozinho.
export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const eu = await exigirUsuario();

  // Uma busca só: os mesmos contatos servem para contar as etapas e para
  // listar os mais recentes. Num CRM pessoal não compensa ir ao banco duas
  // vezes para isso.
  const { data: contatos } = await supabase
    .from("contatos")
    .select("id, nome, email, etapa, criado_em")
    .order("criado_em", { ascending: false });

  const lista = contatos || [];

  const contagem = {};
  for (const etapa of ETAPAS) {
    contagem[etapa] = lista.filter((c) => c.etapa === etapa).length;
  }

  const recentes = lista.slice(0, 5);

  return (
    <Shell usuario={eu}>
      <h1 className="titulo-da-tela">Dashboard</h1>
      <p className="subtitulo-da-tela">Os números do funil agora.</p>

      <section className="painel">
        <div className="quadro quadro-total">
          <strong className="numero">{lista.length}</strong>
          <span className="rotulo">no total</span>
        </div>

        {ETAPAS.map((etapa) => (
          <div key={etapa} className="quadro">
            <strong className="numero">{contagem[etapa]}</strong>
            <span className={`etiqueta ${classeDaEtapa(etapa)}`}>{etapa}</span>
          </div>
        ))}
      </section>

      <div className="painel-de-baixo">
        <section className="bloco-do-painel">
          <h2 className="titulo-lista">Distribuição do funil</h2>
          <Grafico contagem={contagem} total={lista.length} />
        </section>

        <section className="bloco-do-painel">
          <h2 className="titulo-lista">Últimos contatos cadastrados</h2>
          <Recentes contatos={recentes} />
        </section>
      </div>
    </Shell>
  );
}

// Barras horizontais, uma por etapa. O comprimento é medido contra a maior
// etapa, não contra o total: com poucos contatos, a comparação com o total
// deixaria todas as barras num fiapo e o gráfico não diria nada.
function Grafico({ contagem, total }) {
  if (total === 0) {
    return <p className="vazio">Nenhum contato cadastrado ainda.</p>;
  }

  const maior = Math.max(...ETAPAS.map((etapa) => contagem[etapa]));

  return (
    <ul className="grafico">
      {ETAPAS.map((etapa) => (
        <li key={etapa} className="linha-do-grafico">
          <span className={`etiqueta ${classeDaEtapa(etapa)}`}>{etapa}</span>

          <span className="trilho">
            <span
              className={`barra ${classeDaEtapa(etapa)}`}
              style={{ width: `${maior ? (contagem[etapa] / maior) * 100 : 0}%` }}
            />
          </span>

          <span className="valor-do-grafico">{contagem[etapa]}</span>
        </li>
      ))}
    </ul>
  );
}

function Recentes({ contatos }) {
  if (contatos.length === 0) {
    return <p className="vazio">Nenhum contato cadastrado ainda.</p>;
  }

  return (
    <ul className="lista">
      {contatos.map((contato) => (
        <li key={contato.id} className="item">
          <Link className="linha-do-contato" href={`/contatos/${contato.id}`}>
            <span className="dados-do-achado">
              <strong className="nome">{contato.nome}</strong>
              <span className="apoio">{contato.email || "—"}</span>
            </span>
            <span className="idade-do-contato">
              {tempoDesde(contato.criado_em)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
