"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "../../lib/supabase";
import { exigirUsuario } from "../../lib/autenticacao";

// Toda ação daqui confere de novo se quem pediu é admin. O menu esconder o
// botão não basta: alguém poderia chamar a ação por fora da tela.
// Os ids do banco são UUID. Recusar o que não tem essa cara evita mandar lixo
// para o Postgres e receber de volta um erro técnico.
const FORMATO_DE_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function exigirAdmin() {
  const usuario = await exigirUsuario();
  if (usuario.papel !== "admin") {
    return null;
  }
  return usuario;
}

export async function aprovarUsuario(id) {
  const admin = await exigirAdmin();
  if (!admin) return { ok: false, erro: "Só o administrador pode aprovar." };

  if (!FORMATO_DE_ID.test(id || "")) {
    return { ok: false, erro: "Não foi possível aprovar. Tente de novo." };
  }

  const { error } = await supabase
    .from("usuarios")
    .update({ situacao: "aprovado" })
    .eq("id", id);

  if (error) return { ok: false, erro: "Não foi possível aprovar. Tente de novo." };

  revalidatePath("/usuarios");
  return { ok: true };
}

export async function reprovarUsuario(id) {
  const admin = await exigirAdmin();
  if (!admin) return { ok: false, erro: "Só o administrador pode reprovar." };

  if (!FORMATO_DE_ID.test(id || "")) {
    return { ok: false, erro: "Não foi possível reprovar. Tente de novo." };
  }

  // O admin não pode se reprovar e ficar sem ninguém para aprovar os outros.
  if (admin.id === id) {
    return { ok: false, erro: "Você não pode remover o seu próprio acesso." };
  }

  const { error } = await supabase
    .from("usuarios")
    .update({ situacao: "pendente" })
    .eq("id", id);

  if (error) return { ok: false, erro: "Não foi possível reprovar. Tente de novo." };

  revalidatePath("/usuarios");
  return { ok: true };
}
