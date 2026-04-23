"use client";

import useSWR from 'swr';
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { OccupancyTrend, TypeDonut } from "@/components/ReportsCharts";
import { Calendar, Download } from "lucide-react";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ReportsPage() {
  const { data } = useSWR('/api/stats', fetcher, { refreshInterval: 3000 });

  return (
    <main className="min-h-screen">
      {/* Header com a identidade visual da imagem */}
      <PageHeader
        eyebrow="RELATÓRIOS"
        title="Histórico e inteligência do seu pátio."
        description="Acompanhe ocupação, receita e tempo médio de permanência. Exporte relatórios e compartilhe com o time."
        actions={
          <div className="flex items-center gap-3">
            <button className="glass flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)] transition hover:opacity-90">
              <Calendar size={18} className="text-[var(--color-text-muted)]" /> Últimos 7 dias
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:scale-[1.02] transition-transform">
              <Download size={18} /> Exportar
            </button>
          </div>
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-20 space-y-8">
        {/* KPI Cards: Estilo idêntico à imagem (Vagas Livres, Ocupação, etc) */}
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="VAGAS LIVRES" value="58" sub="de 160 no total" trend="+ 4.2%" trendUp />
            <StatCard label="OCUPAÇÃO" value="53%" sub="em relação a ontem" trend="- 2.1%" trendUp={false} />
            <StatCard label="TEMPO MÉDIO" value="1h 12m" sub="permanência" trend="+ 1.5%" trendUp />
            <StatCard label="FATURAMENTO DO DIA" value="R$ 4.820" sub="vs média semanal" trend="+ 8.9%" trendUp />
          </div>
        </Reveal>

        {/* Gráficos Principais */}
        <div className="grid lg:grid-cols-3 gap-6">
          <Reveal className="lg:col-span-2">
            <div className="glass h-full rounded-3xl border border-[var(--color-border)] p-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-semibold">Ocupação ao longo do dia</h3>
                  <p className="text-xs text-[var(--color-text-muted)]">Hoje vs média da semana</p>
                </div>
              </div>
              <div className="h-[300px]">
                <OccupancyTrend data={data?.historical} />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="glass h-full rounded-3xl border border-[var(--color-border)] p-6 text-center">
               <h3 className="text-lg font-semibold mb-2">Distribuição atual</h3>
               <p className="text-xs text-[var(--color-text-muted)] mb-8">Status das vagas agora</p>
               <TypeDonut />
            </div>
          </Reveal>
        </div>
      </div>
    </main>
  );
}

// Sub-componente para os Cards de KPI (Mantendo o estilo visual da foto)
function StatCard({ label, value, sub, trend, trendUp }: any) {
  return (
    <div className="glass group rounded-3xl border border-[var(--color-border)] p-6 transition-all hover:opacity-95">
      <div className="flex items-start justify-between mb-4">
        <span className="text-[10px] font-bold tracking-widest text-[var(--color-text-muted)] uppercase">{label}</span>
        <span className={`flex items-center px-2 py-1 rounded-lg text-[10px] font-bold ${trendUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
          {trendUp ? '↗' : '↘'} {trend}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight text-[var(--color-text)]">{value}</h2>
        <p className="text-xs text-[var(--color-text-muted)]">{sub}</p>
      </div>
    </div>
  );
}
