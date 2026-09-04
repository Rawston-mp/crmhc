import { Manrope } from "next/font/google";
import "./globals.css";

// Fonte única do projeto (design.md). O Next baixa e serve a Manrope
// junto com o site, sem depender do Google no momento em que a página abre.
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: "Meu CRM",
  description: "Contatos e oportunidades de negócio em um só lugar.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={manrope.className}>
      <body>{children}</body>
    </html>
  );
}
