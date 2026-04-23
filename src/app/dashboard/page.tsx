"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { AnimatePresence, motion } from "framer-motion";
import {
  Car,
  CircleDot,
  Lock,
  Radio,
  Wifi,
  WifiOff,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";

const SPOT_COUNT = 7;

type Status = "free" | "occupied" | "reserved";
type Mode = "mock" | "real";

const STATUS_META: Record<
  Status,
  { label: string; tone: string; bg: string; border: string; icon: typeof Car }
> = {
  free: {
    label: "Livre",
    tone: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    icon: Car,
  },
  occupied: {
    label: "Ocupada",
    tone: "text-[var(--color-text-muted)]",
    bg: "bg-[var(--color-overlay-soft)]",
    border: "border-[var(--color-border)]",
    icon: Car,
  },
  reserved: {
    label: "Reservada",
    tone: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    icon: Lock,
  },
};

function randomMockStatus(): Status {
  const r = Math.random();
  if (r < 0.5) return "free";
  if (r < 0.85) return "occupied";
  return "reserved";
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function DashboardPage() {
  const [mode, setMode] = useState<Mode>("mock");
  const [mockStatuses, setMockStatuses] = useState<Status[]>(() =>
    Array.from({ length: SPOT_COUNT }, () => randomMockStatus())
  );

  useEffect(() => {
    if (mode !== "mock") return;
    const id = setInterval(() => {
      setMockStatuses((prev) => {
        const next = [...prev];
        const idx = Math.floor(Math.random() * SPOT_COUNT);
        next[idx] = randomMockStatus();
        return next;
      });
    }, 2000);
    return () => clearInterval(id);
  }, [mode]);

  const { data: real } = useSWR<{ vagas: boolean[]; updatedAt: string | null }>(
    mode === "real" ? "/api/spots" : null,
    fetcher,
    { refreshInterval: 2000 }
  );

  const realStatuses: Status[] = useMemo(() => {
    const vagas = real?.vagas ?? [];
    return Array.from({ length: SPOT_COUNT }, (_, i) => {
      if (i < vagas.length) return vagas[i] ? "free" : "occupied";
      return "occupied";
    });
  }, [real]);

  const statuses = mode === "mock" ? mockStatuses : realStatuses;
  const hasRealData = (real?.vagas?.length ?? 0) > 0;

  const counts = useMemo(
    () => ({
      free: statuses.filter((s) => s === "free").length,
      occupied: statuses.filter((s) => s === "occupied").length,
      reserved: statuses.filter((s) => s === "reserved").length,
    }),
    [statuses]
  );

  const lastSync = real?.updatedAt
    ? new Date(real.updatedAt).toLocaleTimeString("pt-BR")
    : null;

  return (
    <>
      <PageHeader
        eyebrow="DASHBOARD"
        title="Vagas ao vivo."
        description="Alterne entre dados simulados (Mock) e a leitura real do sensor ESP32."
        actions={
          <div className="inline-flex rounded-xl border border-[var(--color-border)] bg-[var(--color-overlay-soft)] p-1 backdrop-blur-sm">
            <ToggleButton active={mode === "mock"} onClick={() => setMode("mock")}>
              <CircleDot size={14} /> Mock
            </ToggleButton>
            <ToggleButton active={mode === "real"} onClick={() => setMode("real")}>
              <Radio size={14} /> Real
            </ToggleButton>
          </div>
        }
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-20 space-y-6">
        {mode === "real" && (
          <Reveal>
            <ConnectionBanner connected={hasRealData} lastSync={lastSync} />
          </Reveal>
        )}

        <Reveal delay={0.05}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CounterCard
              label="LIVRES"
              value={counts.free}
              total={SPOT_COUNT}
              accent="emerald"
            />
            <CounterCard
              label="OCUPADAS"
              value={counts.occupied}
              total={SPOT_COUNT}
              accent="slate"
            />
            <CounterCard
              label="RESERVADAS"
              value={counts.reserved}
              total={SPOT_COUNT}
              accent="amber"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm p-6">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
              <div>
                <h3 className="text-lg font-semibold">Setor A · 7 vagas</h3>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {mode === "mock"
                    ? "Simulação atualizando a cada 2s"
                    : "Leitura em tempo real do ESP32 · /api/spots"}
                </p>
              </div>
              <ModeBadge mode={mode} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              <AnimatePresence initial={false}>
                {statuses.map((status, idx) => (
                  <SpotCard key={idx} index={idx} status={status} />
                ))}
              </AnimatePresence>
            </div>

            <LegendRow />
          </div>
        </Reveal>

        {mode === "real" && (
          <Reveal delay={0.15}>
            <IntegrationHelp />
          </Reveal>
        )}
      </div>
    </>
  );
}

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${
        active
          ? "text-white"
          : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
      }`}
    >
      {active && (
        <motion.span
          layoutId="dash-toggle"
          className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-500 shadow-lg shadow-indigo-500/20"
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      )}
      {children}
    </button>
  );
}

function ModeBadge({ mode }: { mode: Mode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase ${
        mode === "mock"
          ? "bg-indigo-500/10 text-indigo-500 dark:text-indigo-300 border border-indigo-500/20"
          : "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          mode === "mock" ? "bg-indigo-500" : "bg-cyan-500"
        } pulse-ring`}
      />
      {mode === "mock" ? "Modo Mock" : "Modo Real"}
    </span>
  );
}

function ConnectionBanner({
  connected,
  lastSync,
}: {
  connected: boolean;
  lastSync: string | null;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm ${
        connected
          ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-200"
          : "border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-200"
      }`}
    >
      {connected ? <Wifi size={16} /> : <WifiOff size={16} />}
      <span>
        {connected
          ? `Sensor conectado · última leitura ${lastSync ?? "agora"}`
          : "Aguardando dados do sensor ESP32 em /api/spots"}
      </span>
    </div>
  );
}

function CounterCard({
  label,
  value,
  total,
  accent,
}: {
  label: string;
  value: number;
  total: number;
  accent: "emerald" | "slate" | "amber";
}) {
  const palette = {
    emerald: {
      bar: "from-emerald-500 to-emerald-400",
      text: "text-emerald-500",
      dot: "bg-emerald-500",
    },
    slate: {
      bar: "from-slate-500 to-slate-400",
      text: "text-[var(--color-text)]",
      dot: "bg-slate-500",
    },
    amber: {
      bar: "from-amber-500 to-amber-400",
      text: "text-amber-500",
      dot: "bg-amber-500",
    },
  }[accent];

  const pct = total > 0 ? (value / total) * 100 : 0;

  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold tracking-widest text-[var(--color-text-muted)] uppercase">
          {label}
        </span>
        <span className={`h-2 w-2 rounded-full ${palette.dot}`} />
      </div>
      <div className="flex items-baseline gap-2">
        <motion.span
          key={value}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-4xl font-bold tracking-tight ${palette.text}`}
        >
          {value}
        </motion.span>
        <span className="text-sm text-[var(--color-text-muted)]">/ {total}</span>
      </div>
      <div className="mt-4 h-1.5 w-full rounded-full bg-[var(--chart-track)] overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${palette.bar}`}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 180, damping: 24 }}
        />
      </div>
    </div>
  );
}

function SpotCard({ index, status }: { index: number; status: Status }) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className={`group relative rounded-2xl border ${meta.border} ${meta.bg} p-4 flex flex-col items-center justify-center aspect-[1/1.1]`}
      title={`Vaga ${index + 1} — ${meta.label}`}
    >
      <motion.div
        key={status}
        initial={{ rotate: -10, scale: 0.7, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`${meta.tone}`}
      >
        <Icon size={28} strokeWidth={1.8} />
      </motion.div>
      <span className="mt-2 text-xs font-semibold text-[var(--color-text)]">
        Vaga {index + 1}
      </span>
      <span className={`mt-0.5 text-[10px] uppercase tracking-wider ${meta.tone}`}>
        {meta.label}
      </span>
      {status === "free" && (
        <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-emerald-500 pulse-ring" />
      )}
    </motion.div>
  );
}

function LegendRow() {
  return (
    <div className="mt-6 flex flex-wrap gap-4 text-xs text-[var(--color-text-muted)]">
      <LegendItem color="bg-emerald-500/80" label="Livre" />
      <LegendItem color="bg-slate-500/60" label="Ocupada" />
      <LegendItem color="bg-amber-500/80" label="Reservada" />
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} /> {label}
    </span>
  );
}

function IntegrationHelp() {
  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm p-6">
      <h4 className="text-sm font-semibold mb-1">Como conectar o ESP32</h4>
      <p className="text-xs text-[var(--color-text-muted)] mb-4">
        Envie um POST a cada 2 segundos com o array de 7 booleanos.{" "}
        <code className="text-indigo-500 dark:text-indigo-300">true</code> = vaga
        livre, <code className="text-indigo-500 dark:text-indigo-300">false</code>{" "}
        = ocupada.
      </p>
      <pre className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4 text-[11px] leading-relaxed text-[var(--color-text)] overflow-x-auto">
{`POST /api/spots
Content-Type: application/json

{
  "vagas": [true, false, true, true, false, true, false]
}`}
      </pre>
    </div>
  );
}
