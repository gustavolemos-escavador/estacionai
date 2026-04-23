"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Activity, Bell, BarChart3, MapPinned } from "lucide-react";

const STEPS = [
  {
    icon: MapPinned,
    title: "Mapa em tempo real",
    body: "Visualize cada vaga do seu estacionamento em uma grade animada — livre, ocupada, reservada ou ponto EV.",
  },
  {
    icon: Bell,
    title: "Notificações inteligentes",
    body: "Avisos instantâneos de liberação, reservas e anomalias chegam direto na sua caixa de entrada.",
  },
  {
    icon: Activity,
    title: "IA observando o fluxo",
    body: "Modelos analisam padrões de uso, detectam picos e prevêem a ocupação das próximas horas.",
  },
  {
    icon: BarChart3,
    title: "Relatórios históricos",
    body: "Explore dias, semanas e meses — entenda receita, permanência média e conversão por setor.",
  },
];

export default function ScrollStory() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const progress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={ref}
      className="relative"
      style={{ height: `${STEPS.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-aurora opacity-80" />
        <div className="absolute inset-0 grid-lines opacity-40" />

        <div className="relative h-full mx-auto max-w-7xl px-4 sm:px-6 grid md:grid-cols-2 items-center gap-10">
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)] mb-4">
              Como funciona
            </p>

            <div className="relative">
              <div className="absolute -left-1 top-1 h-full w-px bg-white/10 hidden md:block" />
              <motion.div
                style={{ height: progress }}
                className="absolute -left-1 top-1 w-px bg-gradient-to-b from-[var(--color-brand)] to-[var(--color-brand-2)] hidden md:block"
              />

              <div className="flex flex-col gap-12 md:pl-8">
                {STEPS.map((s, i) => (
                  <Step
                    key={s.title}
                    index={i}
                    total={STEPS.length}
                    icon={s.icon}
                    title={s.title}
                    body={s.body}
                    progress={scrollYProgress}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="relative hidden md:block h-[70vh]">
            <ParallaxPreview progress={scrollYProgress} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({
  index,
  total,
  icon: Icon,
  title,
  body,
  progress,
}: {
  index: number;
  total: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  body: string;
  progress: import("framer-motion").MotionValue<number>;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const opacity = useTransform(progress, [start - 0.05, start + 0.05, end - 0.05, end + 0.05], [0.35, 1, 1, 0.35]);
  const x = useTransform(progress, [start, end], [0, -8]);

  return (
    <motion.div style={{ opacity, x }} className="relative">
      <span className="absolute -left-10 top-1 hidden md:flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-surface-2)] border border-white/10 text-xs">
        {index + 1}
      </span>
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-brand)]/20 to-[var(--color-brand-2)]/20 border border-white/10">
          <Icon size={18} className="text-white" />
        </span>
        <div>
          <h3 className="text-xl sm:text-2xl font-semibold">{title}</h3>
          <p className="text-[var(--color-text-muted)] mt-1 max-w-md">{body}</p>
        </div>
      </div>
    </motion.div>
  );
}

function ParallaxPreview({ progress }: { progress: import("framer-motion").MotionValue<number> }) {
  const y1 = useTransform(progress, [0, 1], [0, -80]);
  const y2 = useTransform(progress, [0, 1], [0, -160]);
  const rot = useTransform(progress, [0, 1], [-3, 3]);

  return (
    <div className="relative h-full">
      <motion.div
        style={{ y: y1, rotate: rot }}
        className="absolute inset-0 rounded-3xl glass p-4"
      >
        <div className="rounded-2xl bg-[var(--color-surface)] h-full p-5">
          <div className="text-xs text-[var(--color-text-muted)] mb-3">
            Ocupação ao vivo
          </div>
          <div className="grid grid-cols-10 gap-1.5">
            {Array.from({ length: 80 }).map((_, i) => {
              const on = (i * 7) % 4 !== 0;
              return (
                <div
                  key={i}
                  className={`aspect-square rounded ${
                    on
                      ? "bg-[var(--color-brand)]/70"
                      : "bg-white/5 border border-white/5"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </motion.div>

      <motion.div
        style={{ y: y2 }}
        className="absolute -bottom-6 -right-6 w-64 glass rounded-2xl p-4 shadow-2xl shadow-black/40"
      >
        <div className="text-xs text-[var(--color-text-muted)]">Notificação</div>
        <div className="mt-1 text-sm font-medium">
          Vaga A007 foi liberada
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-[var(--color-ok)]">
          <span className="h-2 w-2 rounded-full bg-[var(--color-ok)] pulse-ring" />
          há alguns segundos
        </div>
      </motion.div>
    </div>
  );
}
