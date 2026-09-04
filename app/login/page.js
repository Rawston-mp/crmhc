import Link from "next/link";
import { redirect } from "next/navigation";
import { jaEstaLogado } from "./acoes";
import Formulario from "./formulario";

export const dynamic = "force-dynamic";

export default async function PaginaDeLogin() {
  if (await jaEstaLogado()) {
    redirect("/");
  }

  return (
    <main className="tela-de-login">
      <div className="cartao caixa-de-login">
        <h1 className="marca">Meu CRM</h1>
        <p className="apoio">Acesso restrito.</p>
        <Formulario />

        <p className="rodape-do-cartao">
          Não tem acesso? <Link href="/register">Criar cadastro</Link>
        </p>
      </div>
    </main>
  );
}
