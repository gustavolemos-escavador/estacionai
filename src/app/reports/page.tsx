import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import {
  AvgStayChart,
  OccupancyTrend,
  RevenueChart,
  TypeDonut,
} from "@/components/ReportsCharts";
import KpiCards from "@/components/KpiCards";
import { buildHistorical, buildKpis, buildSectors, buildSpots } from "@/lib/mockData";
import { Calendar, Download } from "lucide-react";

export default function ReportsPage() {
  const historical = buildHistorical();
  const spots = buildSpots();
  const sectors = buildSectors(spots);
  const kpis = buildKpis(sectors);

  return (
    <>
      <PageHeader
        eyebrow="Relatórios"
        title="Histórico e inteligência do seu pátio."
        description="Acompanhe ocupação, receita e tempo médio de permanência. Exporte relatórios e compartilhe com o time."
        actions={
          <>
            <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10 transition">
              <Calendar size={16} /> Últimos 7 dias
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-brand-2)] px-4 py-2 text-sm font-medium text-white shadow-lg shadow-[var(--color-brand)]/20 hover:shadow-[var(--color-brand)]/40 transition">
              <Download size={16} /> Exportar
            </button>
          </>
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-12 space-y-6">
        <Reveal>
          <KpiCards cards={kpis} />
        </Reveal>

        <div className="grid lg:grid-cols-3 gap-6">
          <Reveal className="lg:col-span-2">
            <OccupancyTrend data={historical} />
          </Reveal>
          <Reveal delay={0.1}>
            <TypeDonut />
          </Reveal>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Reveal>
            <RevenueChart data={historical} />
          </Reveal>
          <Reveal delay={0.1}>
            <AvgStayChart data={historical} />
          </Reveal>
        </div>

        <Reveal>
          <div className="rounded-2xl border border-white/10 bg-[var(--color-surface)]/70 p-4 sm:p-6 overflow-x-auto">
            <h3 className="text-base font-semibold mb-3">Resumo por setor</h3>
            <table className="w-full text-sm min-w-[560px]">
              <thead className="text-left text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                <tr className="border-b border-white/10">
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
                      className="border-b border-white/5 hover:bg-white/[0.02]"
                    >
                      <td className="py-3 pr-4 font-medium">{s.name}</td>
                      <td className="py-3 pr-4">{s.total}</td>
                      <td className="py-3 pr-4 text-[var(--color-ok)]">
                        {s.free}
                      </td>
                      <td className="py-3 pr-4">{s.occupied}</td>
                      <td className="py-3 pr-4 text-[var(--color-warn)]">
                        {s.reserved}
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-28 rounded-full bg-white/5 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-brand-2)]"
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
    </>
  );
}
