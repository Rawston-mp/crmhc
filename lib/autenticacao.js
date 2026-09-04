import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { supabase } from "./supabase";
import { NOME_DO_COOKIE, idDaSessao } from "./sessao";

// Quem está usando o sistema agora. Só devolve alguém que:
// 1) tem um cookie com assinatura válida e dentro do prazo;
// 2) ainda existe no banco;
// 3) está aprovado.
// O cookie sozinho não basta: se o admin reprovar alguém, a pessoa perde o
// acesso na requisição seguinte, sem precisar esperar a sessão vencer.
export async function usuarioAtual() {
  const potes = await cookies();
  const id = idDaSessao(potes.get(NOME_DO_COOKIE)?.value, process.env.SESSAO_SEGREDO);

  if (!id) return null;

  const { data } = await supabase
    .from("usuarios")
    .select("id, usuario, papel, situacao")
    .eq("id", id)
    .single();

  if (!data || data.situacao !== "aprovado") return null;

  return data;
}

// Usar no começo de toda tela e ação de dentro do sistema.
export async function exigirUsuario() {
  const usuario = await usuarioAtual();
  if (!usuario) redirect("/login");
  return usuario;
}

export async function ehAdmin(usuario) {
  return usuario?.papel === "admin";
}
