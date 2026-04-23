"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Car, Plug, Lock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ParkingSpot, SpotStatus } from "@/lib/types";

const STATUS_STYLES: Record<
  SpotStatus,
  { bg: string; border: string; label: string; text: string }
> = {
  free: {
    bg: "bg-[var(--color-ok)]/15",
    border: "border-[var(--color-ok)]/40",
    label: "Livre",
    text: "text-[var(--color-ok)]",
  },
  occupied: {
    bg: "bg-white/[0.04]",
    border: "border-white/10",
    label: "Ocupada",
    text: "text-[var(--color-text-muted)]",
  },
  reserved: {
    bg: "bg-[var(--color-warn)]/15",
    border: "border-[var(--color-warn)]/40",
    label: "Reservada",
    text: "text-[var(--color-warn)]",
  },
  ev: {
    bg: "bg-[var(--color-brand-2)]/15",
    border: "border-[var(--color-brand-2)]/40",
    label: "EV",
    text: "text-[var(--color-brand-2)]",
  },
};

export default function ParkingGrid({
  spots: initial,
}: {
  spots: ParkingSpot[];
}) {
  const [spots, setSpots] = useState(initial);
  const [filter, setFilter] = useState<"all" | SpotStatus>("all");
  const [selectedSector, setSelectedSector] = useState<string>("A");

  useEffect(() => {
    const id = setInterval(() => {
      setSpots((prev) => {
        const next = [...prev];
        const pick = Math.floor(Math.random() * next.length);
        const s = next[pick];
        const flip: SpotStatus =
          s.status === "free"
            ? "occupied"
            : s.status === "occupied"
            ? "free"
            : s.status;
        next[pick] = { ...s, status: flip };
        return next;
      });
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const sectors = useMemo(
    () => Array.from(new Set(spots.map((s) => s.sector))),
    [spots]
  );

  const visible = useMemo(() => {
    return spots
      .filter((s) => s.sector === selectedSector)
      .filter((s) => (filter === "all" ? true : s.status === filter));
  }, [spots, filter, selectedSector]);

  const counts = useMemo(() => {
    const inSector = spots.filter((s) => s.sector === selectedSector);
    return {
      free: inSector.filter((s) => s.status === "free").length,
      occupied: inSector.filter((s) => s.status === "occupied").length,
      reserved: inSector.filter((s) => s.status === "reserved").length,
      ev: inSector.filter((s) => s.status === "ev").length,
      total: inSector.length,
    };
  }, [spots, selectedSector]);

  return (
    <section className="rounded-2xl border border-white/10 bg-[var(--color-surface)]/70 p-4 sm:p-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl font-semibold">Mapa de vagas ao vivo</h2>
          <p className="text-sm text-[var(--color-text-muted)]">
            Atualiza automaticamente a cada poucos segundos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
            {sectors.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSector(s)}
                className={`px-3 py-1.5 text-sm rounded-lg transition ${
                  selectedSector === s
                    ? "bg-white/10 text-white"
                    : "text-[var(--color-text-muted)] hover:text-white"
                }`}
              >
                Setor {s}
              </button>
            ))}
          </div>

          <div className="inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-1">
            {(
              [
                ["all", "Todas"],
                ["free", "Livres"],
                ["occupied", "Ocupadas"],
                ["reserved", "Reservadas"],
                ["ev", "EV"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1.5 text-xs rounded-lg transition ${
                  filter === key
                    ? "bg-white/10 text-white"
                    : "text-[var(--color-text-muted)] hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <Stat label="Total" value={counts.total} />
        <Stat label="Livres" value={counts.free} tone="ok" />
        <Stat label="Ocupadas" value={counts.occupied} tone="muted" />
        <Stat label="Reservadas" value={counts.reserved} tone="warn" />
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
        <AnimatePresence mode="popLayout">
          {visible.map((spot) => {
            const st = STATUS_STYLES[spot.status];
            return (
              <motion.div
                key={spot.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ type: "spring", stiffness: 280, damping: 24 }}
                className={`group relative aspect-[1.3/1] rounded-lg border ${st.border} ${st.bg} flex flex-col items-center justify-center text-[10px]`}
                title={`${spot.label} — ${st.label}`}
              >
                {spot.status === "free" && (
                  <Car size={14} className={st.text} />
                )}
                {spot.status === "occupied" && (
                  <span className="h-1.5 w-5 rounded-full bg-white/20" />
                )}
                {spot.status === "reserved" && (
                  <Lock size={12} className={st.text} />
                )}
                {spot.status === "ev" && <Plug size={14} className={st.text} />}
                <span className="mt-1 text-[9px] text-[var(--color-text-muted)]">
                  {spot.label}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <footer className="mt-6 flex flex-wrap items-center gap-4 text-xs text-[var(--color-text-muted)]">
        <Legend className="bg-[var(--color-ok)]/15 border border-[var(--color-ok)]/40">
          Livre
        </Legend>
        <Legend className="bg-white/[0.04] border border-white/10">
          Ocupada
        </Legend>
        <Legend className="bg-[var(--color-warn)]/15 border border-[var(--color-warn)]/40">
          Reservada
        </Legend>
        <Legend className="bg-[var(--color-brand-2)]/15 border border-[var(--color-brand-2)]/40">
          EV
        </Legend>
      </footer>
    </section>
  );
}

function Legend({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-3 w-3 rounded ${className}`} />
      {children}
    </span>
  );
}

function Stat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "ok" | "warn" | "muted";
}) {
  const map: Record<string, string> = {
    default: "text-white",
    ok: "text-[var(--color-ok)]",
    warn: "text-[var(--color-warn)]",
    muted: "text-[var(--color-text-muted)]",
  };
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
      <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
        {label}
      </div>
      <div className={`text-xl font-semibold mt-1 ${map[tone]}`}>{value}</div>
    </div>
  );
}
