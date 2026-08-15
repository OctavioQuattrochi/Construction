"use client";

import { Printer } from "lucide-react";

/** Abre el diálogo de impresión (permite "Guardar como PDF"). */
export function PrintButton({
  label = "Descargar PDF",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <button
      onClick={() => window.print()}
      className={
        className ??
        "inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
      }
    >
      <Printer className="h-4 w-4" /> {label}
    </button>
  );
}
