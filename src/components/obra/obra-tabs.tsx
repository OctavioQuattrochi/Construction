"use client";

import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  Package,
  BookOpen,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "resumen", label: "Resumen", icon: LayoutDashboard },
  { key: "avance", label: "Avance", icon: TrendingUp },
  { key: "dinero", label: "Dinero", icon: Wallet },
  { key: "materiales", label: "Materiales", icon: Package },
  { key: "libro", label: "Libro de obra", icon: BookOpen },
  { key: "gente", label: "Participantes", icon: Users },
] as const;

export type ObraTabKey = (typeof TABS)[number]["key"];

/**
 * Pestañas del tablero. Los paneles ya vienen renderizados desde el servidor:
 * cambiar de pestaña es instantáneo (no hay ida y vuelta a la base).
 * La URL se sincroniza para poder compartir el link de una pestaña.
 */
export function ObraTabs({
  obraId,
  initial,
  panels,
}: {
  obraId: string;
  initial?: string;
  panels: Record<ObraTabKey, ReactNode>;
}) {
  const [active, setActive] = useState<ObraTabKey>(
    (TABS.find((t) => t.key === initial)?.key ?? "resumen") as ObraTabKey
  );

  function select(key: ObraTabKey) {
    setActive(key);
    window.history.replaceState(null, "", `/mi-obra/${obraId}?tab=${key}`);
  }

  return (
    <>
      <div className="thin-scrollbar mt-6 flex gap-2 overflow-x-auto pb-2">
        {TABS.map((t) => {
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              onClick={() => select(t.key)}
              className={cn(
                "relative flex shrink-0 items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition-colors duration-150",
                isActive
                  ? "border-ink-900 bg-ink-900 text-white"
                  : "border-ink-200 bg-white text-ink-600 hover:border-ink-300 hover:bg-ink-50"
              )}
            >
              <t.icon className={cn("h-4 w-4", isActive && "text-amber-400")} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Sólo se muestra el panel activo; ya están todos renderizados. */}
      <motion.div
        key={active}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        {panels[active]}
      </motion.div>
    </>
  );
}
