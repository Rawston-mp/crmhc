import { supabase } from "../lib/supabase";
import { exigirUsuario } from "../lib/autenticacao";
import Contatos from "./contatos";
import Navbar from "./navbar";

// Esta página roda no servidor: busca a lista no banco antes de mandar a tela
// pronta para o navegador. Sempre com dados atuais, sem cache.
export const dynamic = "force-dynamic";

export default async function PaginaInicial() {
  const eu = await exigirUsuario();

  const { data: contatos } = await supabase
    .from("contatos")
    .select("id, nome, email, telefone, etapa")
    .order("criado_em", { ascending: false });

  return (
    <>
      <Navbar usuario={eu} />

      <main className="conteudo">
        <Contatos contatosIniciais={contatos || []} />
      </main>
    </>
  );
}
