"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { KpiCard } from "@/lib/types";

export default function KpiCards({ cards }: { cards: KpiCard[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((c, i) => {
        const up = c.delta >= 0;
        return (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.5 }}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-[var(--color-surface)]/70 p-4 sm:p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                {c.label}
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] ${
                  up
                    ? "bg-[var(--color-ok)]/15 text-[var(--color-ok)]"
                    : "bg-[var(--color-danger)]/15 text-[var(--color-danger)]"
                }`}
              >
                {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {Math.abs(c.delta).toFixed(1)}%
              </span>
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">
              {c.value}
            </div>
            {c.hint && (
              <div className="mt-1 text-xs text-[var(--color-text-muted)]">
                {c.hint}
              </div>
            )}
            <div className="pointer-events-none absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-[var(--color-brand)]/10 blur-2xl" />
          </motion.div>
        );
      })}
    </div>
  );
}
