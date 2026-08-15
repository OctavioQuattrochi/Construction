"use client";

import Link from "next/link";
import { Wallet, ArrowRight, Info } from "lucide-react";
import { estimateBudget } from "@/lib/budget";
import { formatCurrency } from "@/lib/utils";
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
      </div>

      {/* El costo se muestra siempre: el valor va gratis. */}
      <div>
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

      {/* La cuenta se pide para lo que requiere persistencia, no para ver el número. */}
      {!isMember ? (
        <div className="flex flex-col gap-2 border-t border-ink-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-500">
            Creá tu cuenta gratis para <strong className="text-ink-700">guardar</strong>{" "}
            este cálculo, actualizar sus precios y exportarlo en PDF.
          </p>
          <Link
            href="/ingresar"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-ink-950 transition-colors hover:bg-amber-600"
          >
            Crear cuenta <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
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
