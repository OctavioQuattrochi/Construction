"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Wallet,
  Store,
  Printer,
  ExternalLink,
  RefreshCw,
  Info,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Line {
  key: string;
  label: string;
  qty: number;
  unit: string | null;
  unitPrice: number | null;
  subtotal: number | null;
  store: string | null;
  url: string | null;
}
interface BudgetData {
  lines: Line[];
  total: number;
  pricedCount: number;
  unpricedCount: number;
  byStore: { store: string; total: number; count: number }[];
  capturedAt: string;
}

export function ObraBudget({ items }: { items: { key: string; qty: number }[] }) {
  const [data, setData] = useState<BudgetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/obra-budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error");
      setData(json as BudgetData);
    } catch {
      setError("No pudimos traer los precios. Probá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-3 rounded-3xl border border-ink-100 bg-white p-8 text-ink-500">
        <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
        Calculando precios reales en el comparador…
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-3xl border border-ink-100 bg-white p-8 text-center">
        <p className="text-ink-500">{error ?? "Sin datos."}</p>
        <button onClick={load} className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:underline">
          <RefreshCw className="h-4 w-4" /> Reintentar
        </button>
      </div>
    );
  }

  const captured = new Date(data.capturedAt).toLocaleString("es-AR", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <div id="obra-presupuesto" className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-ink-100 bg-ink-950 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-amber-400">
            <Wallet className="h-4 w-4" /> Presupuesto de tu obra
          </p>
          <p className="mt-2 font-display text-3xl font-bold">
            {formatCurrency(data.total)}
          </p>
          <p className="text-xs text-concrete-400">
            {data.pricedCount} material(es) con precio real · en pesos · {captured}
          </p>
        </div>
        <div className="flex gap-2 print:hidden">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
          >
            <Printer className="h-4 w-4" /> Imprimir / PDF
          </button>
          <button
            onClick={load}
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-ink-950 hover:bg-amber-600"
          >
            <RefreshCw className="h-4 w-4" /> Actualizar
          </button>
        </div>
      </div>

      {/* Líneas */}
      <div className="divide-y divide-ink-50">
        {data.lines.map((l) => (
          <div key={l.key} className="flex items-center justify-between gap-3 px-6 py-3">
            <div className="min-w-0">
              <p className="truncate font-medium text-ink-900">{l.label}</p>
              <p className="text-xs text-ink-400">
                {l.qty} {l.unit ?? ""}
                {l.unitPrice != null && (
                  <> · {formatCurrency(l.unitPrice)} c/u · {l.store}</>
                )}
              </p>
            </div>
            {l.subtotal != null ? (
              <span className="shrink-0 font-mono font-semibold text-ink-900">
                {formatCurrency(l.subtotal)}
              </span>
            ) : (
              <Link
                href={`/comparador?q=${encodeURIComponent(l.label.split(" (")[0])}`}
                className="shrink-0 text-xs font-medium text-amber-600 hover:underline print:text-ink-400"
              >
                consultar
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Total + por tienda */}
      <div className="border-t border-ink-100 bg-concrete-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <span className="font-display font-bold text-ink-900">Total estimado</span>
          <span className="font-display text-xl font-bold text-amber-600">
            {formatCurrency(data.total)}
          </span>
        </div>
        {data.unpricedCount > 0 && (
          <p className="mt-2 flex items-start gap-1.5 text-xs text-ink-400">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {data.unpricedCount} material(es) sin precio en vivo confiable (áridos,
            terminaciones): consultalos directo en el comparador. No los sumamos para
            no darte un número equivocado.
          </p>
        )}
      </div>

      {data.byStore.length > 0 && (
        <div className="border-t border-ink-100 px-6 py-4">
          <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-ink-700">
            <Store className="h-4 w-4 text-amber-500" /> Dónde comprar más barato
          </p>
          <div className="space-y-1.5">
            {data.byStore.map((s) => (
              <div key={s.store} className="flex items-center justify-between text-sm">
                <span className="text-ink-600">
                  {s.store} <span className="text-ink-400">({s.count} ítem/s)</span>
                </span>
                <span className="font-mono font-medium text-ink-900">
                  {formatCurrency(s.total)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="px-6 py-3 text-xs text-ink-400">
        Precios reales tomados del comparador (más barato en vivo por material).
        Orientativos: confirmá siempre con el proveedor antes de comprar.
      </p>
    </div>
  );
}
