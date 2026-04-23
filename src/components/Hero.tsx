"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRef } from "react";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center text-xs text-[var(--color-text-muted)]">
      Carregando cena 3D…
    </div>
  ),
});

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-[100svh] pt-32 pb-12 overflow-hidden bg-aurora"
    >
      <div className="absolute inset-0 grid-lines opacity-60 pointer-events-none" />

      <motion.div
        style={{ y, opacity }}
        className="relative mx-auto max-w-7xl px-4 sm:px-6"
      >
        <div className="flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-overlay-soft)] px-3 py-1 text-xs text-[var(--color-text-muted)]"
          >
            <Sparkles size={12} className="text-[var(--color-brand-2)]" />
            Hackathon Escavador · Estacionamento com IA
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-black tracking-tight leading-[0.95] text-5xl sm:text-7xl md:text-8xl lg:text-[9rem]"
          >
            <span>Estacion</span>
            <span className="bg-gradient-to-r from-[var(--color-brand)] via-fuchsia-400 to-[var(--color-brand-2)] bg-clip-text text-transparent">
              AI
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12 }}
            className="mt-6 max-w-2xl text-base sm:text-lg text-[var(--color-text-muted)]"
          >
            Seu carro chega, a IA enxerga e o painel responde — vagas em tempo
            real, notificações inteligentes e relatórios, tudo em um só lugar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="mt-8 flex flex-col sm:flex-row items-center gap-3"
          >
            <Link
              href="/dashboard"
              prefetch
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-brand-2)] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-[var(--color-brand)]/30 hover:shadow-[var(--color-brand)]/50 transition-shadow"
            >
              Ver vagas agora <ArrowRight size={16} />
            </Link>
            <Link
              href="/reports"
              prefetch
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-overlay-soft)] px-6 py-3 text-sm text-[var(--color-text)] hover:bg-[var(--color-overlay-strong)] transition-colors"
            >
              Ver relatórios
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-12 mx-auto w-full max-w-6xl"
        >
          <div className="relative rounded-3xl overflow-hidden border border-[var(--color-border)] glass h-[360px] sm:h-[440px] md:h-[520px]">
            <HeroScene />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
