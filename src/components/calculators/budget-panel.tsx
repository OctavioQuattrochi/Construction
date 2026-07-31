"use client";

import Link from "next/link";
import { Lock, Wallet, ArrowRight, Info } from "lucide-react";
import { estimateBudget } from "@/lib/budget";
import { formatCurrency, cn } from "@/lib/utils";
import type { BudgetItem } from "@/lib/calculators";

export function BudgetPanel({
  budget,
  isMember,
}: {
  budget: BudgetItem[];
  isMember: boolean;
}) {
  const est = estimateBudget(budget);

  // Etapas sin materiales presupuestables (ej. excavación / mano de obra).
  if (est.lines.length === 0) {
    return (
      <div className="mt-4 flex items-start gap-2 rounded-2xl border border-ink-100 bg-white p-4 text-xs text-ink-400">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        Esta etapa es principalmente mano de obra o servicio; no tiene materiales
        para presupuestar.
      </div>
    );
  }

  return (
    <div className="mt-4 overflow-hidden rounded-3xl border border-amber-200 bg-white shadow-soft">
      <div className="flex items-center gap-2 border-b border-amber-100 bg-amber-50 px-5 py-3">
        <Wallet className="h-4 w-4 text-amber-600" />
        <h3 className="font-display text-sm font-bold text-ink-900">
          Presupuesto estimado
        </h3>
        {!isMember && <Lock className="ml-auto h-3.5 w-3.5 text-ink-400" />}
      </div>

      {/* Contenido: nítido para miembros, difuminado para invitados */}
      <div className="relative">
        <div className={cn(!isMember && "pointer-events-none select-none blur-[5px]")}>
          <div className="divide-y divide-ink-50">
            {est.lines.map((l) => (
              <div key={l.key} className="flex items-center justify-between gap-3 px-5 py-2.5 text-sm">
                <div className="min-w-0">
                  <p className="truncate text-ink-700">{l.label}</p>
                  <p className="text-xs text-ink-400">
                    {formatCurrency(l.unitPrice)} × {l.qty} {l.unit}
                  </p>
                </div>
                <span className="shrink-0 font-mono font-semibold text-ink-900">
                  {formatCurrency(l.subtotal)}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-ink-100 bg-concrete-50 px-5 py-3">
            <span className="font-display font-bold text-ink-900">Total estimado</span>
            <span className="font-display text-lg font-bold text-amber-600">
              {formatCurrency(est.total)}
            </span>
          </div>
        </div>

        {/* Overlay para invitados */}
        {!isMember && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/60 p-6 text-center backdrop-blur-[2px]">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-900 text-amber-400">
              <Lock className="h-5 w-5" />
            </div>
            <p className="max-w-xs text-sm font-medium text-ink-900">
              Registrate gratis para ver el costo estimado de tu obra
            </p>
            <Link
              href="/ingresar"
              className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-ink-950 transition-colors hover:bg-amber-600"
            >
              Ver presupuesto <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>

      {isMember && (
        <div className="flex items-center justify-between gap-2 border-t border-ink-100 px-5 py-3 text-xs text-ink-400">
          <span>Precios de referencia · orientativos</span>
          <Link href="/comparador" className="shrink-0 font-medium text-amber-600 hover:underline">
            Ver precios reales →
          </Link>
        </div>
      )}
    </div>
  );
}
