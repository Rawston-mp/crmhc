import { supabase } from "../../lib/supabase";
import { exigirUsuario } from "../../lib/autenticacao";
import Shell from "../shell";
import Formulario from "./formulario";
import Busca from "./busca";

export const dynamic = "force-dynamic";

export default async function PaginaDeContatos() {
  const eu = await exigirUsuario();

  const { data: contatos } = await supabase
    .from("contatos")
    .select("id, nome, email, etapa")
    .order("criado_em", { ascending: false });

  return (
    <Shell usuario={eu}>
      <h1 className="titulo-da-tela">Contatos</h1>
      <p className="subtitulo-da-tela">
        Ache um contato pelo nome ou email, ou cadastre um novo.
      </p>

      <section className="bloco-de-busca">
        <Busca contatos={contatos || []} />
      </section>

      <section className="cartao bloco-lista">
        <h2>Novo contato</h2>
        <Formulario />
      </section>
    </Shell>
  );
}
