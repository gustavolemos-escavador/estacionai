"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { HistoricalPoint } from "@/lib/types";

export default function OccupancyChart({ data }: { data: HistoricalPoint[] }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[var(--color-surface)]/70 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-semibold">Ocupação ao longo do dia</h3>
          <p className="text-xs text-[var(--color-text-muted)]">
            Percentual médio por horário
          </p>
        </div>
        <span className="text-xs text-[var(--color-text-muted)]">Hoje</span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="occ" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6d5cff" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#00d1b2" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 6" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="time"
              stroke="#8a91a8"
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="#8a91a8"
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              unit="%"
            />
            <Tooltip
              contentStyle={{
                background: "#0b0e17",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                fontSize: 12,
              }}
              labelStyle={{ color: "#e6e9f2" }}
              formatter={(v: number) => [`${v}%`, "Ocupação"]}
            />
            <Area
              type="monotone"
              dataKey="occupancy"
              stroke="#6d5cff"
              strokeWidth={2}
              fill="url(#occ)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
