import Link from "next/link";

import { supabase } from "../../../lib/supabase";
import { exigirUsuario } from "../../../lib/autenticacao";
import { tempoDesde } from "../../../lib/tempo";
import Shell from "../../shell";
import Etapa from "../etapa";
import Anotacoes from "../anotacoes";
import FollowUps from "../followups";

export const dynamic = "force-dynamic";

// Os ids do banco são UUID. Recusar o que não tem essa cara evita mandar lixo
// para o Postgres só porque alguém digitou qualquer coisa no endereço.
const FORMATO_DE_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function PaginaDoContato({ params }) {
  const eu = await exigirUsuario();
  const { id } = await params;

  const contato = FORMATO_DE_ID.test(id)
    ? (
        await supabase
          .from("contatos")
          .select("id, nome, email, telefone, etapa, criado_em")
          .eq("id", id)
          .maybeSingle()
      ).data
    : null;

  if (!contato) {
    return (
      <Shell usuario={eu}>
        <h1 className="titulo-da-tela">Contato não encontrado</h1>
        <p className="subtitulo-da-tela">
          Este contato não existe mais, ou o endereço está errado.
        </p>

        <section className="cartao">
          <p>
            <Link href="/funil">Voltar para o Funil</Link>
          </p>
        </section>
      </Shell>
    );
  }

  return (
    <Shell usuario={eu}>
      <p className="voltar">
        <Link href="/funil">Voltar para o Funil</Link>
      </p>

      <header className="topo-do-contato">
        <div>
          <h1 className="titulo-da-tela">{contato.nome}</h1>
          <p className="dados-do-contato">
            <span>{contato.email || "sem email"}</span>
            <span>{contato.telefone || "sem telefone"}</span>
          </p>
        </div>

        <div className="etapa-do-contato">
          <Etapa
            contatoId={contato.id}
            nome={contato.nome}
            etapaInicial={contato.etapa}
          />
          <span className="idade-do-contato">
            meu contato {tempoDesde(contato.criado_em)}
          </span>
        </div>
      </header>

      <section className="secao-do-contato">
        <h2 className="titulo-lista">Anotações</h2>
        <Anotacoes contatoId={contato.id} />
      </section>

      <section className="secao-do-contato">
        <h2 className="titulo-lista">Follow-ups</h2>
        <p className="apoio-da-secao">
          A IA escreve a partir das anotações e da etapa. Quem envia é você, por
          fora — aqui a mensagem fica guardada para reler.
        </p>
        <FollowUps contatoId={contato.id} />
      </section>
    </Shell>
  );
}
