import { Manrope, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// As duas fontes do projeto (design.md). O Next baixa e serve junto com o site,
// sem depender do Google no momento em que a página abre.
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

// A mono entra só nos números e etiquetas técnicas. Por isso ela vira uma
// variável CSS (--fonte-mono) em vez de ser aplicada no corpo todo.
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
  variable: "--fonte-mono",
});

export const metadata = {
  title: "Meu CRM",
  description: "Contatos e oportunidades de negócio em um só lugar.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${manrope.className} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
