"use client";

import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import {
  AvgStayChart,
  OccupancyTrend,
  RevenueChart,
  TypeDonut,
} from "@/components/ReportsCharts";
import {
  buildHistorical,
  buildKpis,
  buildSectors,
  buildSpots,
} from "@/lib/mockData";
import { Calendar, Download } from "lucide-react";
import { useMemo } from "react";

export default function ReportsPage() {
  const historical = useMemo(() => buildHistorical(), []);
  const spots = useMemo(() => buildSpots(), []);
  const sectors = useMemo(() => buildSectors(spots), [spots]);
  const kpis = useMemo(() => buildKpis(sectors), [sectors]);

  return (
    <main className="min-h-screen">
      <PageHeader
        eyebrow="RELATÓRIOS"
        title="Histórico e inteligência do seu pátio."
        description="Acompanhe ocupação, receita e tempo médio de permanência. Exporte relatórios e compartilhe com o time."
        actions={
          <div className="flex items-center gap-3">
            <button className="glass flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)] transition hover:opacity-90">
              <Calendar size={18} className="text-[var(--color-text-muted)]" />{" "}
              Últimos 7 dias
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-transform">
              <Download size={18} /> Exportar
            </button>
          </div>
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-20 space-y-8">
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map((k) => (
              <StatCard
                key={k.label}
                label={k.label.toUpperCase()}
                value={k.value}
                sub={k.hint ?? ""}
                trend={`${k.delta >= 0 ? "+ " : "- "}${Math.abs(
                  k.delta
                ).toFixed(1)}%`}
                trendUp={k.delta >= 0}
              />
            ))}
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-3 gap-6 items-start">
          <Reveal className="lg:col-span-2">
            <OccupancyTrend data={historical} />
          </Reveal>
          <Reveal delay={0.1}>
            <TypeDonut />
          </Reveal>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <Reveal>
            <RevenueChart data={historical} />
          </Reveal>
          <Reveal delay={0.1}>
            <AvgStayChart data={historical} />
          </Reveal>
        </div>

        <Reveal>
          <div className="glass rounded-3xl border border-[var(--color-border)] p-4 sm:p-6 overflow-x-auto">
            <h3 className="text-base font-semibold mb-3">Resumo por setor</h3>
            <table className="w-full text-sm min-w-[560px]">
              <thead className="text-left text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                <tr className="border-b border-[var(--color-border)]">
                  <th className="py-2 pr-4">Setor</th>
                  <th className="py-2 pr-4">Total</th>
                  <th className="py-2 pr-4">Livres</th>
                  <th className="py-2 pr-4">Ocupadas</th>
                  <th className="py-2 pr-4">Reservadas</th>
                  <th className="py-2 pr-4">Ocupação</th>
                </tr>
              </thead>
              <tbody>
                {sectors.map((s) => {
                  const pct = Math.round((s.occupied / s.total) * 100);
                  return (
                    <tr
                      key={s.id}
                      className="border-b border-[var(--color-border)] hover:bg-[var(--color-overlay-soft)]"
                    >
                      <td className="py-3 pr-4 font-medium">{s.name}</td>
                      <td className="py-3 pr-4">{s.total}</td>
                      <td className="py-3 pr-4 text-emerald-400">{s.free}</td>
                      <td className="py-3 pr-4">{s.occupied}</td>
                      <td className="py-3 pr-4 text-amber-400">{s.reserved}</td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-28 rounded-full bg-white/5 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-[var(--color-text-muted)]">
                            {pct}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  sub,
  trend,
  trendUp,
}: {
  label: string;
  value: string;
  sub: string;
  trend: string;
  trendUp: boolean;
}) {
  return (
    <div className="glass group rounded-3xl border border-[var(--color-border)] p-6 transition-all hover:opacity-95">
      <div className="flex items-start justify-between mb-4">
        <span className="text-[10px] font-bold tracking-widest text-[var(--color-text-muted)] uppercase">
          {label}
        </span>
        <span
          className={`flex items-center px-2 py-1 rounded-lg text-[10px] font-bold ${
            trendUp
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-rose-500/10 text-rose-400"
          }`}
        >
          {trendUp ? "↗" : "↘"} {trend}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text)]">
          {value}
        </h2>
        <p className="text-xs text-[var(--color-text-muted)]">{sub}</p>
      </div>
    </div>
  );
}
