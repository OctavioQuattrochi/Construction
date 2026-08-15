"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { HardHat, Loader2, X } from "lucide-react";
import { materialLabel } from "@/lib/budget";
import { trackMaterialsToObra } from "@/lib/track";
import type { BudgetItem } from "@/lib/calculators";

// Manda los materiales del cálculo a una obra del usuario.
export function AddToObraButton({
  budget,
  isMember,
}: {
  budget: BudgetItem[];
  isMember: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [obras, setObras] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  if (budget.length === 0) return null;

  async function openPicker() {
    if (!isMember) {
      toast.info("Iniciá sesión para usar Mi obra.");
      router.push("/ingresar");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/obra-materials");
      const json = await res.json();
      if (!res.ok) throw new Error();
      if (!json.obras?.length) {
        toast.info("Creá tu obra primero.");
        router.push("/mi-obra");
        return;
      }
      setObras(json.obras);
      setOpen(true);
    } catch {
      toast.error("No pudimos cargar tus obras.");
    } finally {
      setLoading(false);
    }
  }

  async function addTo(obraId: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/obra-materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          obraId,
          source: "calculadora",
          items: budget.map((b) => ({
            label: materialLabel(b.key),
            qty: Math.round(b.qty * 100) / 100,
          })),
        }),
      });
      if (!res.ok) throw new Error();
      trackMaterialsToObra(budget.length, "calculadora");
      toast.success("Materiales agregados a tu obra");
      setOpen(false);
      router.push(`/mi-obra/${obraId}?tab=materiales`);
    } catch {
      toast.error("No se pudo agregar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={openPicker}
        disabled={loading}
        className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <HardHat className="h-4 w-4 text-amber-400" />
        )}
        Agregar a mi obra
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-elevated">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-ink-900">
                ¿A qué obra?
              </h2>
              <button onClick={() => setOpen(false)} className="text-ink-400 hover:text-ink-900">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-2">
              {obras.map((o) => (
                <button
                  key={o.id}
                  onClick={() => addTo(o.id)}
                  disabled={loading}
                  className="flex w-full items-center gap-2 rounded-xl border border-ink-200 px-4 py-3 text-left text-sm font-medium text-ink-800 transition-colors hover:border-amber-500 hover:bg-amber-500/10 disabled:opacity-50"
                >
                  <HardHat className="h-4 w-4 text-amber-500" />
                  {o.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
