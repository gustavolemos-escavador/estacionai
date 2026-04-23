"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Info,
  MailOpen,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { Notification } from "@/lib/types";

const TYPE_MAP = {
  info: {
    icon: Info,
    color: "text-sky-400",
    bg: "bg-sky-500/10",
    ring: "ring-sky-500/20",
  },
  success: {
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    ring: "ring-emerald-500/20",
  },
  warning: {
    icon: TriangleAlert,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    ring: "ring-amber-500/20",
  },
  alert: {
    icon: AlertTriangle,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    ring: "ring-rose-500/20",
  },
} as const;

type Filter = "all" | "unread" | Notification["type"];

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "Todas" },
  { key: "unread", label: "Não lidas" },
  { key: "alert", label: "Alertas" },
  { key: "warning", label: "Avisos" },
  { key: "success", label: "Sucesso" },
  { key: "info", label: "Info" },
];

export default function InboxList({ initial }: { initial: Notification[] }) {
  const [items, setItems] = useState<Notification[]>(initial);
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(
    () =>
      items.filter((n) => {
        if (filter === "all") return true;
        if (filter === "unread") return !n.read;
        return n.type === filter;
      }),
    [items, filter]
  );

  const unread = useMemo(() => items.filter((n) => !n.read).length, [items]);

  const markAll = () =>
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) =>
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  const remove = (id: string) =>
    setItems((prev) => prev.filter((n) => n.id !== id));

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/70 overflow-hidden">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 sm:p-5 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-brand)]/30 to-[var(--color-brand-2)]/30 border border-[var(--color-border)]">
            <MailOpen size={18} />
          </span>
          <div>
            <h2 className="text-lg font-semibold">Caixa de entrada</h2>
            <p className="text-xs text-[var(--color-text-muted)]">
              {unread} não lidas · {items.length} no total
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex flex-wrap rounded-xl border border-[var(--color-border)] bg-[var(--color-overlay-soft)] p-1">
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                  filter === key
                    ? "bg-[var(--color-overlay-strong)] text-[var(--color-text)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={markAll}
            disabled={unread === 0}
            className="text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-overlay-soft)] px-3 py-1.5 transition-colors hover:bg-[var(--color-overlay-strong)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Marcar todas como lidas
          </button>
        </div>
      </header>

      {filtered.length === 0 ? (
        <div className="p-12 text-center text-sm text-[var(--color-text-muted)]">
          Nenhuma notificação nesse filtro.
        </div>
      ) : (
        <ul className="divide-y divide-[var(--color-border)]">
          {filtered.map((n) => {
            const t = TYPE_MAP[n.type];
            const Icon = t.icon;
            return (
              <li
                key={n.id}
                className={`group relative flex items-start gap-3 p-4 sm:p-5 transition-colors ${
                  n.read
                    ? "hover:bg-[var(--color-overlay-soft)]"
                    : "bg-[var(--color-overlay-soft)] hover:bg-[var(--color-overlay-strong)]"
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute left-0 top-1/2 -translate-y-1/2 h-8 w-0.5 rounded-r ${
                    n.read ? "bg-transparent" : "bg-[var(--color-brand-2)]"
                  }`}
                />
                <span
                  className={`mt-0.5 inline-flex h-9 w-9 flex-none items-center justify-center rounded-xl ring-1 ${t.bg} ${t.color} ${t.ring}`}
                >
                  <Icon size={16} />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3
                      className={`text-sm ${
                        n.read
                          ? "text-[var(--color-text-muted)]"
                          : "text-[var(--color-text)] font-semibold"
                      }`}
                    >
                      {n.title}
                    </h3>
                    <span className="text-xs text-[var(--color-text-muted)]">
                      · {n.time}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)] line-clamp-2">
                    {n.body}
                  </p>
                </div>

                <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  {!n.read && (
                    <button
                      onClick={() => markRead(n.id)}
                      className="text-[11px] rounded-lg border border-[var(--color-border)] bg-[var(--color-overlay-soft)] px-2 py-1 transition-colors hover:bg-[var(--color-overlay-strong)]"
                    >
                      Marcar lida
                    </button>
                  )}
                  <button
                    onClick={() => remove(n.id)}
                    aria-label="Remover"
                    className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-[var(--color-border)] bg-[var(--color-overlay-soft)] transition-colors hover:bg-rose-500/15 hover:border-rose-500/40 hover:text-rose-400"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
