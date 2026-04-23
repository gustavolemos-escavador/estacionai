import PageHeader from "@/components/PageHeader";
import KpiCards from "@/components/KpiCards";
import ParkingGrid from "@/components/ParkingGrid";
import OccupancyChart from "@/components/OccupancyChart";
import Reveal from "@/components/Reveal";
import {
  buildHistorical,
  buildKpis,
  buildSectors,
  buildSpots,
  mockNotifications,
} from "@/lib/mockData";
import { Bell } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const spots = buildSpots();
  const sectors = buildSectors(spots);
  const kpis = buildKpis(sectors);
  const historical = buildHistorical();
  const unread = mockNotifications.filter((n) => !n.read);

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title="Suas vagas, ao vivo."
        description="Monitore ocupação, reservas e anomalias em tempo real. Escolha um setor ou filtre por status — tudo reativo e responsivo."
        actions={
          <Link
            href="/inbox"
            className="relative inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-overlay-soft)] px-4 py-2 text-sm hover:bg-[var(--color-overlay-strong)] transition"
          >
            <Bell size={16} />
            Caixa de entrada
            {unread.length > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-danger)] px-1.5 text-[10px] font-semibold text-white">
                {unread.length}
              </span>
            )}
          </Link>
        }
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 pb-12 space-y-6">
        <Reveal>
          <KpiCards cards={kpis} />
        </Reveal>

        <div className="grid lg:grid-cols-3 gap-6">
          <Reveal className="lg:col-span-2">
            <ParkingGrid spots={spots} />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-6">
              <OccupancyChart data={historical} />

              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/70 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold">Setores</h3>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    Capacidade
                  </span>
                </div>
                <ul className="mt-4 space-y-3">
                  {sectors.map((s) => {
                    const pct = Math.round((s.occupied / s.total) * 100);
                    return (
                      <li key={s.id}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{s.name}</span>
                          <span className="text-[var(--color-text-muted)]">
                            {s.free} livres · {pct}% ocupação
                          </span>
                        </div>
                        <div className="mt-1.5 h-2 rounded-full bg-[var(--chart-track)] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-brand-2)]"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
