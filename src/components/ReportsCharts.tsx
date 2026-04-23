"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { HistoricalPoint } from "@/lib/types";

const CHART_HEIGHT = 280;

const axisProps = {
  stroke: "var(--chart-axis)",
  tick: { fontSize: 11 },
  axisLine: false,
  tickLine: false,
};

const tooltipStyle = {
  background: "var(--chart-tooltip-bg)",
  border: "1px solid var(--chart-tooltip-border)",
  borderRadius: 12,
  fontSize: 12,
  color: "var(--color-text)",
};

function Card({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/70 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          {subtitle && (
            <p className="text-xs text-[var(--color-text-muted)]">{subtitle}</p>
          )}
        </div>
      </div>
      <div
        className="mt-4 w-full"
        style={{ height: CHART_HEIGHT }}
      >
        {children}
      </div>
      {footer && <div className="mt-4">{footer}</div>}
    </div>
  );
}

export function OccupancyTrend({ data }: { data: HistoricalPoint[] }) {
  const safe = data ?? [];
  return (
    <Card title="Ocupação ao longo do dia" subtitle="Hoje vs média da semana">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={safe} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6d5cff" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#6d5cff" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 6" stroke="var(--chart-grid)" />
          <XAxis dataKey="time" {...axisProps} />
          <YAxis unit="%" domain={[0, 100]} {...axisProps} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v: number) => [`${v}%`, "Ocupação"]}
          />
          <Area
            type="monotone"
            dataKey="occupancy"
            stroke="#6d5cff"
            strokeWidth={2}
            fill="url(#g1)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function RevenueChart({ data }: { data: HistoricalPoint[] }) {
  const safe = data ?? [];
  return (
    <Card title="Receita por horário" subtitle="Em R$">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={safe} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 6" stroke="var(--chart-grid)" />
          <XAxis dataKey="time" {...axisProps} />
          <YAxis {...axisProps} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v: number) => [`R$ ${v}`, "Receita"]}
          />
          <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
            {safe.map((_, i) => (
              <Cell
                key={i}
                fill={i % 2 === 0 ? "#6d5cff" : "#00d1b2"}
                opacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function AvgStayChart({ data }: { data: HistoricalPoint[] }) {
  const safe = data ?? [];
  return (
    <Card title="Tempo médio de permanência" subtitle="Em minutos">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={safe} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 6" stroke="var(--chart-grid)" />
          <XAxis dataKey="time" {...axisProps} />
          <YAxis {...axisProps} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(v: number) => [`${v} min`, "Permanência"]}
          />
          <Line
            type="monotone"
            dataKey="avgStayMinutes"
            stroke="#00d1b2"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "#00d1b2" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

export function TypeDonut() {
  const data = [
    { name: "Ocupadas", value: 86, fill: "#6d5cff" },
    { name: "Livres", value: 42, fill: "#00d1b2" },
    { name: "Reservadas", value: 12, fill: "#ffb020" },
  ];
  return (
    <Card
      title="Distribuição atual"
      subtitle="Status das vagas agora"
      footer={
        <ul className="space-y-1.5 text-xs">
          {data.map((d) => (
            <li key={d.name} className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-[var(--color-text-muted)]">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: d.fill }}
                />
                {d.name}
              </span>
              <span className="font-medium">{d.value}</span>
            </li>
          ))}
        </ul>
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip contentStyle={tooltipStyle} />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            stroke="none"
          >
            {data.map((d, i) => (
              <Cell key={i} fill={d.fill} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}
