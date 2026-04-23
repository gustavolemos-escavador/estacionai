"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="relative pt-32 pb-8">
      <div className="absolute inset-x-0 top-0 h-[420px] bg-aurora opacity-70 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[420px] grid-lines opacity-40 pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-end justify-between gap-6 flex-wrap"
        >
          <div>
            {eyebrow && (
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                {eyebrow}
              </p>
            )}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mt-2 max-w-3xl">
              {title}
            </h1>
            {description && (
              <p className="mt-3 text-[var(--color-text-muted)] max-w-2xl">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </motion.div>
      </div>
    </div>
  );
}
