"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CalcRow {
  label: string;
  value: string;
}
export interface BudgetItemInput {
  key: string;
  qty: number;
}

export function SaveCalculationButton({
  calcType,
  calcName,
  quantity,
  rows,
  budget,
  isMember,
}: {
  calcType: string;
  calcName: string;
  quantity: number;
  rows: CalcRow[];
  budget: BudgetItemInput[];
  isMember: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    if (!isMember) {
      toast.info("Iniciá sesión para guardar cálculos.");
      router.push("/ingresar");
      return;
    }

    setLoading(true);
    try {
      // Solo guardamos label + value de cada fila (sin hints).
      const cleanRows = rows.map((r) => ({ label: r.label, value: r.value }));
      const res = await fetch("/api/calculations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          calcType,
          calcName,
          quantity,
          rows: cleanRows,
          budget,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error");
      setOpen(false);
      setName("");
      toast.success("Cálculo guardado");
      router.push("/mi-cuenta?tab=calculos");
    } catch {
      toast.error("No se pudo guardar");
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-sm font-medium text-ink-950 transition-colors hover:bg-amber-600"
      >
        <Save className="h-4 w-4" /> Guardar cálculo
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-elevated">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink-900">
            Guardar cálculo
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-ink-400 hover:text-ink-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-700">
              Nombre del proyecto
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Casa de 100m²"
              className="mt-2 w-full rounded-xl border border-ink-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none"
              disabled={loading}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="flex-1 rounded-full border border-ink-200 py-2.5 font-medium text-ink-700 transition-colors hover:border-ink-400 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className={cn(
                "flex-1 rounded-full py-2.5 font-medium text-white transition-colors disabled:opacity-50",
                "bg-amber-500 hover:bg-amber-600"
              )}
            >
              {loading ? (
                <Loader2 className="mx-auto h-4 w-4 animate-spin" />
              ) : (
                "Guardar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
