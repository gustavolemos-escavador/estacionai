"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Car, Sparkles } from "lucide-react";
import { useRef } from "react";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const blur = useTransform(scrollYProgress, [0, 1], ["0px", "6px"]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] pt-32 pb-20 overflow-hidden bg-aurora"
    >
      <div className="absolute inset-0 grid-lines opacity-60 pointer-events-none" />
      <motion.div
        style={{ y, opacity, scale, filter: blur }}
        className="relative mx-auto max-w-7xl px-4 sm:px-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center gap-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-[var(--color-text-muted)]">
            <Sparkles size={12} className="text-[var(--color-brand-2)]" />
            Beta aberto · Hackathon Escavador
          </span>

          <h1 className="max-w-4xl text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.02]">
            O estacionamento do futuro{" "}
            <span className="bg-gradient-to-r from-[var(--color-brand)] via-fuchsia-400 to-[var(--color-brand-2)] bg-clip-text text-transparent">
              enxerga por você
            </span>
          </h1>

          <p className="max-w-2xl text-base sm:text-lg text-[var(--color-text-muted)]">
            Veja vagas disponíveis em tempo real, receba notificações inteligentes
            e entenda o histórico do seu pátio — tudo em um único painel, bonito e
            responsivo.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-brand-2)] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-[var(--color-brand)]/30 hover:shadow-[var(--color-brand)]/50 transition-shadow"
            >
              Ver vagas agora <ArrowRight size={16} />
            </Link>
            <Link
              href="/reports"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm text-white hover:bg-white/10 transition-colors"
            >
              Ver relatórios
            </Link>
          </div>
        </motion.div>

        <HeroPreview />
      </motion.div>
    </section>
  );
}

function HeroPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: -8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="relative mt-14 mx-auto max-w-5xl"
      style={{ perspective: 1200 }}
    >
      <div className="glass rounded-3xl p-3 shadow-2xl shadow-black/50">
        <div className="rounded-2xl border border-white/10 bg-[var(--color-surface)] p-5 sm:p-7">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
            </div>
            <span className="text-xs text-[var(--color-text-muted)]">
              estacionai.app/dashboard
            </span>
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-ok)] pulse-ring" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {[
              { k: "Vagas livres", v: "42" },
              { k: "Ocupação", v: "67%" },
              { k: "Tempo médio", v: "1h 12m" },
              { k: "Receita hoje", v: "R$ 4.820" },
            ].map((s, i) => (
              <motion.div
                key={s.k}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="rounded-xl border border-white/5 bg-white/[0.03] p-3"
              >
                <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
                  {s.k}
                </div>
                <div className="text-lg font-semibold mt-1">{s.v}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-12 gap-2">
            {Array.from({ length: 60 }).map((_, i) => {
              const free = (i * 7) % 5 !== 0 && (i * 3) % 11 !== 0;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.012 }}
                  className={`aspect-[1.4/1] rounded-md flex items-center justify-center ${
                    free
                      ? "bg-[var(--color-ok)]/15 border border-[var(--color-ok)]/30"
                      : "bg-white/5 border border-white/5"
                  }`}
                >
                  {free ? (
                    <Car size={10} className="text-[var(--color-ok)]" />
                  ) : null}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
