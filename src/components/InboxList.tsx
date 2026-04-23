"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  MailOpen,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { useState } from "react";
import type { Notification } from "@/lib/types";

const TYPE_MAP = {
  info: { icon: Info, color: "text-blue-500", bg: "bg-blue-500/10" },
  success: {
    icon: CheckCircle2,
    color: "text-[var(--color-ok)]",
    bg: "bg-[var(--color-ok)]/10",
  },
  warning: {
    icon: TriangleAlert,
    color: "text-[var(--color-warn)]",
    bg: "bg-[var(--color-warn)]/10",
  },
  alert: {
    icon: AlertTriangle,
    color: "text-[var(--color-danger)]",
    bg: "bg-[var(--color-danger)]/10",
  },
} as const;

type Filter = "all" | "unread" | Notification["type"];

export default function InboxList({
  initial,
}: {
  initial: Notification[];
}) {
  const [items, setItems] = useState<Notification[]>(initial);
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = items.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    return n.type === filter;
  });

  const markAll = () =>
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id: string) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  const remove = (id: string) =>
    setItems((prev) => prev.filter((n) => n.id !== id));

  const unread = items.filter((n) => !n.read).length;

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
          <div className="inline-flex rounded-xl border border-[var(--color-border)] bg-[var(--color-overlay-soft)] p-1">
            {(
              [
                ["all", "Todas"],
                ["unread", "Não lidas"],
                ["alert", "Alertas"],
                ["warning", "Avisos"],
                ["success", "Sucesso"],
                ["info", "Info"],
              ] as const
            ).map(([k, l]) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={`px-3 py-1.5 text-xs rounded-lg transition ${
                  filter === k
                    ? "bg-[var(--color-overlay-strong)] text-[var(--color-text)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <button
            onClick={markAll}
            className="text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-overlay-soft)] px-3 py-1.5 hover:bg-[var(--color-overlay-strong)] transition"
          >
            Marcar todas como lidas
          </button>
        </div>
      </header>

      <ul className="divide-y divide-[var(--color-border)]">
        <AnimatePresence initial={false}>
          {filtered.map((n) => {
            const t = TYPE_MAP[n.type];
            const Icon = t.icon;
            return (
              <motion.li
                key={n.id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 26 }}
                className={`group relative flex items-start gap-3 p-4 sm:p-5 hover:bg-[var(--color-overlay-soft)] transition ${
                  !n.read ? "bg-[var(--color-overlay-soft)]" : ""
                }`}
              >
                <span
                  className={`mt-0.5 inline-flex h-9 w-9 flex-none items-center justify-center rounded-xl ${t.bg} ${t.color}`}
                >
                  <Icon size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {!n.read && (
                      <span className="h-2 w-2 rounded-full bg-[var(--color-brand-2)]" />
                    )}
                    <h3
                      className={`text-sm ${
                        n.read ? "text-[var(--color-text-muted)]" : "text-[var(--color-text)] font-medium"
                      }`}
                    >
                      {n.title}
                    </h3>
                    <span className="text-xs text-[var(--color-text-muted)]">
                      · {n.time}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    {n.body}
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                  {!n.read && (
                    <button
                      onClick={() => markRead(n.id)}
                      className="text-[11px] rounded-lg border border-[var(--color-border)] bg-[var(--color-overlay-soft)] px-2 py-1 hover:bg-[var(--color-overlay-strong)]"
                    >
                      Marcar lida
                    </button>
                  )}
                  <button
                    onClick={() => remove(n.id)}
                    className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-[var(--color-border)] bg-[var(--color-overlay-soft)] hover:bg-[var(--color-danger)]/20 hover:border-[var(--color-danger)]/40 transition"
                    aria-label="Remover"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
        {filtered.length === 0 && (
          <li className="p-12 text-center text-sm text-[var(--color-text-muted)]">
            Nenhuma notificação nesse filtro.
          </li>
        )}
      </ul>
    </div>
  );
}
