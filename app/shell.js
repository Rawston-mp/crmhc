import BotaoSair from "./sair";
import Navegacao from "./navegacao";

// A moldura de todas as telas de dentro do sistema (design.md, seção 5):
// cabeçalho no topo, navegação lateral à esquerda, conteúdo à direita.
// `largo` solta o limite de largura da área de conteúdo. As telas de leitura
// mantêm o limite; o Kanban, que é um quadro, usa a tela toda.
export default function Shell({ usuario, largo, children }) {
  return (
    <div className="app">
      <header className="cabecalho">
        <span className="marca">Meu CRM</span>

        <div className="lado-direito">
          <span className="quem-sou">
            {usuario.usuario}
            {usuario.papel === "admin" && (
              <span className="selo-admin">admin</span>
            )}
          </span>
          <BotaoSair />
        </div>
      </header>

      <Navegacao ehAdmin={usuario.papel === "admin"} />

      <main className={largo ? "conteudo conteudo-largo" : "conteudo"}>
        {children}
      </main>
    </div>
  );
}
