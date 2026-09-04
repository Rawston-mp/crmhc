"use client";

import { sair } from "./login/acoes";

export default function BotaoSair() {
  return (
    <form action={sair}>
      <button type="submit" className="link-acao">
        Sair
      </button>
    </form>
  );
}
