import { supabase } from "../../lib/supabase";
import { exigirUsuario } from "../../lib/autenticacao";
import Shell from "../shell";
import Lista from "./lista";

export const dynamic = "force-dynamic";

export default async function PaginaDeUsuarios() {
  const eu = await exigirUsuario();

  if (eu.papel !== "admin") {
    return (
      <Shell usuario={eu}>
        <h1 className="titulo-da-tela">Usuários</h1>
        <p className="subtitulo-da-tela">Área restrita.</p>

        <section className="cartao">
          <h2>Área restrita</h2>
          <p>Somente o administrador pode ver e aprovar os cadastros.</p>
        </section>
      </Shell>
    );
  }

  // Pendentes primeiro: é o que exige ação.
  const { data: usuarios } = await supabase
    .from("usuarios")
    .select("id, usuario, papel, situacao, criado_em")
    .order("situacao", { ascending: true })
    .order("criado_em", { ascending: false });

  return (
    <Shell usuario={eu}>
      <h1 className="titulo-da-tela">Usuários</h1>
      <p className="subtitulo-da-tela">
        Quem pede acesso entra aqui como pendente e só usa o CRM depois de
        aprovado.
      </p>

      <Lista usuarios={usuarios || []} meuId={eu.id} />
    </Shell>
  );
}
