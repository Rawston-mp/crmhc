import { Suspense } from "react";

import { supabase } from "../../lib/supabase";
import { exigirUsuario } from "../../lib/autenticacao";
import { ETAPAS, classeDaEtapa } from "../../lib/etapas";
import Shell from "../shell";
import Quadro from "./quadro";

export const dynamic = "force-dynamic";

export default async function PaginaDoFunil() {
  const eu = await exigirUsuario();

  return (
    <Shell usuario={eu} largo>
      <h1 className="titulo-da-tela">Funil</h1>
      <p className="subtitulo-da-tela">
        Arraste um contato para outra coluna para mudar a etapa dele.
      </p>

      {/* O cabeçalho e a navegação aparecem na hora; só as colunas esperam o
          banco. Enquanto a busca não volta, o esqueleto abaixo ocupa o lugar. */}
      <Suspense fallback={<QuadroCarregando />}>
        <QuadroComDados />
      </Suspense>
    </Shell>
  );
}

async function QuadroComDados() {
  const { data: contatos } = await supabase
    .from("contatos")
    .select("id, nome, email, telefone, etapa, criado_em")
    .order("criado_em", { ascending: false });

  return <Quadro contatosIniciais={contatos || []} />;
}

// As colunas já desenhadas, sem os cartões: a tela não pula de lugar quando os
// contatos chegam.
function QuadroCarregando() {
  return (
    <div className="quadro-funil">
      {ETAPAS.map((etapa) => (
        <section key={etapa} className="coluna">
          <header className="topo-da-coluna">
            <span className={`etiqueta ${classeDaEtapa(etapa)}`}>{etapa}</span>
          </header>
          <p className="coluna-vazia">Carregando...</p>
        </section>
      ))}
    </div>
  );
}
