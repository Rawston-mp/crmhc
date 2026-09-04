import { supabase } from "../../lib/supabase";
import { exigirUsuario } from "../../lib/autenticacao";
import Navbar from "../navbar";
import Lista from "./lista";

export const dynamic = "force-dynamic";

export default async function PaginaDeUsuarios() {
  const eu = await exigirUsuario();

  if (eu.papel !== "admin") {
    return (
      <>
        <Navbar usuario={eu} />
        <main className="conteudo">
          <section className="cartao">
            <h2>Área restrita</h2>
            <p>Somente o administrador pode ver e aprovar os cadastros.</p>
          </section>
        </main>
      </>
    );
  }

  // Pendentes primeiro: é o que exige ação.
  const { data: usuarios } = await supabase
    .from("usuarios")
    .select("id, usuario, papel, situacao, criado_em")
    .order("situacao", { ascending: true })
    .order("criado_em", { ascending: false });

  return (
    <>
      <Navbar usuario={eu} />
      <main className="conteudo">
        <Lista usuarios={usuarios || []} meuId={eu.id} />
      </main>
    </>
  );
}
