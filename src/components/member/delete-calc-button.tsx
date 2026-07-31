"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";

export function DeleteCalcButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function remove() {
    if (!confirm("¿Eliminar este cálculo guardado?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/calculations?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Cálculo eliminado");
      router.refresh();
    } catch {
      toast.error("No se pudo eliminar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={remove}
      disabled={loading}
      aria-label="Eliminar cálculo"
      className="shrink-0 rounded-lg p-1.5 text-ink-300 transition-colors hover:bg-red-50 hover:text-red-600"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </button>
  );
}
