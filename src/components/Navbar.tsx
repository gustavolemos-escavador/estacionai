"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bell,
  CarFront,
  LayoutDashboard,
  LineChart,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const NAV = [
  { href: "/", label: "Início", icon: CarFront },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inbox", label: "Caixa de entrada", icon: Bell },
  { href: "/reports", label: "Relatórios", icon: LineChart },
];

export default function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav
          className={`flex items-center justify-between rounded-2xl px-4 sm:px-5 py-3 transition-all ${
            scrolled ? "glass shadow-[0_10px_30px_var(--color-shadow)]" : "bg-transparent"
          }`}
        >
          <Link href="/" className="flex items-center gap-2 group">
            <motion.span
              whileHover={{ rotate: -10, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-2)] text-white shadow-lg shadow-[var(--color-brand)]/30"
            >
              <CarFront size={18} strokeWidth={2.4} />
            </motion.span>
            <span className="text-base sm:text-lg font-semibold tracking-tight">
              Estacion
              <span className="bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-brand-2)] bg-clip-text text-transparent">
                AI
              </span>
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-1">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`relative inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                      active
                        ? "text-[var(--color-text)]"
                        : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 -z-10 rounded-lg bg-[var(--color-overlay-soft)] ring-1 ring-[var(--color-overlay-strong)]"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden md:flex items-center gap-2">
            <button
              aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
              onClick={toggleTheme}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-overlay-soft)] text-[var(--color-text)] transition hover:bg-[var(--color-overlay-strong)]"
            >
              {mounted ? (isDark ? <Sun size={17} /> : <Moon size={17} />) : <Moon size={17} />}
            </button>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-brand-2)] px-4 py-2 text-sm font-medium text-white shadow-lg shadow-[var(--color-brand)]/20 hover:shadow-[var(--color-brand)]/40 transition-shadow"
            >
              Abrir painel
            </Link>
          </div>

          <button
            aria-label="Abrir menu"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-[var(--color-border)] text-[var(--color-text)]"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-2 glass rounded-2xl p-2"
          >
            <ul className="flex flex-col">
              {NAV.map((item) => {
                const Icon = item.icon;
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm ${
                        active
                          ? "bg-[var(--color-overlay-soft)] text-[var(--color-text)]"
                          : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      <Icon size={18} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <button
              aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
              onClick={toggleTheme}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-overlay-soft)] px-3 py-2 text-sm text-[var(--color-text)] transition hover:bg-[var(--color-overlay-strong)]"
            >
              {mounted ? (isDark ? <Sun size={15} /> : <Moon size={15} />) : <Moon size={15} />}
              {isDark ? "Modo claro" : "Modo escuro"}
            </button>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
