import Link from "next/link";
import { CarFront, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-2)]">
            <CarFront size={16} className="text-white" />
          </span>
          <div>
            <p className="text-sm font-semibold">EstacionAI</p>
            <p className="text-xs text-[var(--color-text-muted)]">
              Estacionamento inteligente movido a IA.
            </p>
          </div>
        </div>
        <nav className="flex flex-wrap items-center gap-5 text-sm text-[var(--color-text-muted)]">
          <Link href="/dashboard" className="hover:text-[var(--color-text)]">Dashboard</Link>
          <Link href="/inbox" className="hover:text-[var(--color-text)]">Caixa de entrada</Link>
          <Link href="/reports" className="hover:text-[var(--color-text)]">Relatórios</Link>
          <a
            href="https://vercel.com/new"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 hover:text-[var(--color-text)]"
          >
            <Github size={14} /> Deploy
          </a>
        </nav>
        <p className="text-xs text-[var(--color-text-muted)]">
          © {new Date().getFullYear()} EstacionAI. Hackathon build.
        </p>
      </div>
    </footer>
  );
}
