import Link from "next/link";
import BotaoSair from "./sair";

// Barra de navegação das telas de dentro do sistema.
export default function Navbar({ usuario }) {
  return (
    <header className="cabecalho">
      <div className="lado-esquerdo">
        <span className="marca">Meu CRM</span>
        <nav className="menu">
          <Link href="/">Contatos</Link>
          <Link href="/usuarios">Usuários</Link>
        </nav>
      </div>

      <div className="lado-direito">
        <span className="apoio quem-sou">
          {usuario.usuario}
          {usuario.papel === "admin" && <span className="selo-admin">admin</span>}
        </span>
        <BotaoSair />
      </div>
    </header>
  );
}
