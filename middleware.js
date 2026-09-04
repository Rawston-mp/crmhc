import { NextResponse } from "next/server";
import { NOME_DO_COOKIE, sessaoValida } from "./lib/sessao";

// O porteiro: roda ANTES de qualquer página, dado ou ação do CRM.
// Sem sessão válida, a pessoa é mandada para o login e nada mais acontece.
export function middleware(requisicao) {
  const cookie = requisicao.cookies.get(NOME_DO_COOKIE)?.value;

  if (sessaoValida(cookie, process.env.SESSAO_SEGREDO)) {
    return NextResponse.next();
  }

  const login = new URL("/login", requisicao.url);
  const resposta = NextResponse.redirect(login);
  // Cookie vencido ou adulterado não serve para nada: some daqui.
  resposta.cookies.delete(NOME_DO_COOKIE);
  return resposta;
}

export const config = {
  // Precisa do Node porque a assinatura do cookie usa o crypto do Node.
  runtime: "nodejs",
  // Tudo é protegido, menos as telas públicas (login e cadastro) e os arquivos
  // internos que o Next serve para a página aparecer (scripts, estilos, ícone).
  matcher: ["/((?!login|register|_next/static|_next/image|favicon.ico).*)"],
};
