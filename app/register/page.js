import Link from "next/link";
import { redirect } from "next/navigation";
import { jaEstaLogado } from "../login/acoes";
import Formulario from "./formulario";

export const dynamic = "force-dynamic";

export default async function PaginaDeCadastro() {
  if (await jaEstaLogado()) {
    redirect("/");
  }

  return (
    <main className="tela-de-login">
      <div className="cartao caixa-de-login">
        <h1 className="marca">Meu CRM</h1>
        <p className="apoio">Criar acesso.</p>

        <Formulario />

        <p className="rodape-do-cartao">
          Já tem cadastro? <Link href="/login">Entrar</Link>
        </p>
      </div>
    </main>
  );
}
