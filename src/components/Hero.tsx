"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRef } from "react";

const ROAD_D =
  "M40,340 C 180,340 240,280 380,270 S 620,260 760,200 S 980,120 1160,80";

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

        <RoadAnimation />
      </motion.div>
    </section>
  );
}

function RoadAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative mt-12 mx-auto w-full max-w-6xl"
    >
      <div className="relative rounded-3xl overflow-hidden border border-[var(--color-border)] glass">
        <svg
          viewBox="0 0 1200 400"
          className="w-full h-auto block"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <defs>
            <linearGradient id="hero-road-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0.95" />
              <stop offset="100%" stopColor="var(--color-brand-2)" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="hero-car-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#c7d2fe" />
            </linearGradient>
            <filter id="hero-road-glow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Decoração: pequenas árvores/arbustos ao longo do caminho */}
          {[
            { x: 120, y: 360 },
            { x: 260, y: 340 },
            { x: 450, y: 320 },
            { x: 610, y: 300 },
            { x: 820, y: 250 },
            { x: 940, y: 200 },
          ].map((t, i) => (
            <g key={i} transform={`translate(${t.x} ${t.y})`}>
              <circle r={12} fill="var(--color-brand-2)" opacity={0.18} />
              <circle r={6} fill="var(--color-brand-2)" opacity={0.25} />
            </g>
          ))}

          {/* Base da estrada (largura grossa) */}
          <path
            d={ROAD_D}
            stroke="var(--color-overlay-strong)"
            strokeWidth={28}
            strokeLinecap="round"
            fill="none"
          />

          {/* Linha tracejada central que desenha ao aparecer */}
          <motion.path
            d={ROAD_D}
            stroke="var(--color-text-muted)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray="8 14"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 2, delay: 0.6, ease: "easeOut" }}
          />

          {/* Gradiente brilhante que traça o caminho */}
          <motion.path
            id="hero-road-path"
            d={ROAD_D}
            stroke="url(#hero-road-grad)"
            strokeWidth={3}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.9 }}
            transition={{ duration: 2.5, delay: 0.4, ease: "easeInOut" }}
            filter="url(#hero-road-glow)"
          />

          {/* Estacionamento no final do caminho */}
          <g transform="translate(1040 30)">
            <motion.rect
              width={140}
              height={130}
              rx={10}
              fill="var(--color-overlay-soft)"
              stroke="var(--color-border)"
              strokeWidth={1}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            />
            <text
              x={70}
              y={22}
              textAnchor="middle"
              fontSize={11}
              fill="var(--color-text-muted)"
              fontWeight={700}
              letterSpacing={1.6}
            >
              ESTACIONAMENTO
            </text>

            {[0, 1, 2].map((row) =>
              [0, 1].map((col) => {
                const i = row * 2 + col;
                const isOpen = i === 0 || i === 3;
                return (
                  <motion.g key={i}>
                    <motion.rect
                      x={col === 0 ? 15 : 78}
                      y={38 + row * 28}
                      width={48}
                      height={22}
                      rx={4}
                      fill={isOpen ? "var(--color-ok)" : "var(--color-overlay-strong)"}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: isOpen ? [0.35, 1, 0.35] : 0.6,
                      }}
                      transition={{
                        duration: isOpen ? 2.2 : 0.4,
                        delay: isOpen ? 2 + i * 0.3 : 1.8 + i * 0.15,
                        repeat: isOpen ? Infinity : 0,
                        repeatDelay: isOpen ? 0.6 : 0,
                      }}
                    />
                  </motion.g>
                );
              })
            )}
          </g>

          {/* Carro 1 — principal */}
          <AnimatedCar delay="0s" />
          {/* Carro 2 — sombra/atraso pra estrada nunca ficar vazia */}
          <AnimatedCar delay="3s" secondary />
        </svg>

        {/* Glow nos cantos */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_0_120px_var(--color-bg)]/30" />
      </div>
    </motion.div>
  );
}

function AnimatedCar({
  delay = "0s",
  secondary = false,
}: {
  delay?: string;
  secondary?: boolean;
}) {
  return (
    <g opacity={secondary ? 0.55 : 1}>
      {/* sombra */}
      <ellipse cx={0} cy={8} rx={16} ry={3} fill="#000" opacity={0.45} />
      {/* corpo */}
      <rect
        x={-16}
        y={-8}
        width={32}
        height={14}
        rx={4}
        fill="url(#hero-car-grad)"
        stroke="var(--color-brand)"
        strokeWidth={0.8}
      />
      {/* cabine */}
      <rect
        x={-6}
        y={-6}
        width={14}
        height={7}
        rx={1.5}
        fill="#0b1020"
        opacity={0.9}
      />
      {/* rodas */}
      <circle cx={-10} cy={7} r={3} fill="#111827" />
      <circle cx={10} cy={7} r={3} fill="#111827" />
      {/* farol */}
      <rect x={15} y={-4} width={2.5} height={2.5} rx={0.6} fill="#fef3c7" />
      <animateMotion
        dur="6s"
        begin={delay}
        repeatCount="indefinite"
        rotate="auto"
        keyTimes="0;0.85;0.9;1"
        keyPoints="0;1;1;1"
        calcMode="linear"
      >
        <mpath href="#hero-road-path" />
      </animateMotion>
      <animate
        attributeName="opacity"
        values={secondary ? "0;0.55;0.55;0" : "0;1;1;0"}
        keyTimes="0;0.08;0.9;1"
        dur="6s"
        begin={delay}
        repeatCount="indefinite"
      />
    </g>
  );
}
