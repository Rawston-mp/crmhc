"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// As áreas do sistema. Área nova é uma linha a mais aqui — nada muda de lugar.
const AREAS = [
  { endereco: "/", nome: "Dashboard" },
  { endereco: "/funil", nome: "Funil" },
  { endereco: "/contatos", nome: "Contatos" },
  { endereco: "/usuarios", nome: "Usuários", somenteAdmin: true },
];

// Roda no navegador porque precisa saber em que endereço a pessoa está
// para marcar o item ativo.
export default function Navegacao({ ehAdmin }) {
  const caminho = usePathname();

  return (
    <aside className="lateral">
      <nav className="menu">
        {AREAS.filter((area) => !area.somenteAdmin || ehAdmin).map((area) => (
          <Link
            key={area.endereco}
            href={area.endereco}
            className={caminho === area.endereco ? "ativo" : undefined}
            aria-current={caminho === area.endereco ? "page" : undefined}
          >
            {area.nome}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
