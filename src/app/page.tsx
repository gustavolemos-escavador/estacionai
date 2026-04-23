import Hero from "@/components/Hero";
import ScrollStory from "@/components/ScrollStory";
import Reveal from "@/components/Reveal";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Leaf, ShieldCheck, Zap } from "lucide-react";

const BENEFITS = [
  {
    icon: Zap,
    title: "Tempo real",
    body: "Sensores e câmeras IA alimentam o painel em milissegundos.",
  },
  {
    icon: ShieldCheck,
    title: "Seguro por padrão",
    body: "Autenticação, auditoria de acessos e criptografia ponta a ponta.",
  },
  {
    icon: Leaf,
    title: "Pensado pra EVs",
    body: "Identifique pontos de recarga e priorize usuários elétricos.",
  },
  {
    icon: BadgeCheck,
    title: "Pronto pra escalar",
    body: "De 50 a 50 mil vagas, sem reescrever nada.",
  },
];

export default function Home() {
  return (
    <>
      <Hero />

      <ScrollStory />

      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="flex items-end justify-between gap-6 flex-wrap">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                  Por que EstacionAI
                </p>
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mt-3 max-w-2xl">
                  Design pensado em pessoas, motor pensado em dados.
                </h2>
              </div>
              <p className="text-[var(--color-text-muted)] max-w-md">
                Construímos a partir de sessões de Design Thinking com motoristas,
                operadores e gestores de pátios — cada detalhe tem intenção.
              </p>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {BENEFITS.map((b, i) => {
              const Icon = b.icon;
              return (
                <Reveal key={b.title} delay={i * 0.08}>
                  <div className="group h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-5 hover:bg-[var(--color-surface-2)] transition-colors">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-brand)]/20 to-[var(--color-brand-2)]/20 border border-[var(--color-border)]">
                      <Icon size={18} />
                    </span>
                    <h3 className="mt-4 text-lg font-semibold">{b.title}</h3>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                      {b.body}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-brand)]/20 via-transparent to-[var(--color-brand-2)]/20 p-10 sm:p-14">
              <div className="absolute inset-0 grid-lines opacity-30 pointer-events-none" />
              <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight max-w-xl">
                    Abra o painel e veja suas vagas ao vivo agora.
                  </h3>
                  <p className="text-[var(--color-text-muted)] mt-2 max-w-lg">
                    Sem cadastro — exploramos um pátio de demonstração com dados
                    mockados, prontos para você apresentar no hackathon.
                  </p>
                </div>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-text)] text-[var(--color-surface)] px-5 py-3 text-sm font-semibold hover:opacity-90 transition"
                >
                  Entrar no painel <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
