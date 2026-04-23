import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "EstacionAI — Estacionamento inteligente com IA",
  description:
    "EstacionAI mostra vagas disponíveis em tempo real, envia notificações e entrega relatórios históricos para você tomar decisões melhores.",
  keywords: [
    "estacionamento",
    "vagas",
    "IA",
    "smart parking",
    "EstacionAI",
    "Next.js",
  ],
  authors: [{ name: "EstacionAI" }],
  openGraph: {
    title: "EstacionAI — Estacionamento inteligente",
    description:
      "Vagas em tempo real, notificações e relatórios históricos.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f5fb" },
    { media: "(prefers-color-scheme: dark)", color: "#05060a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <Navbar />
          <main className="relative">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
