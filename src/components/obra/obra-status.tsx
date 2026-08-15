"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Loader2 } from "lucide-react";
import { setObraStatus } from "@/app/(marketing)/mi-obra/actions";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { key: "planificacion", label: "En planificación" },
  { key: "ejecucion", label: "En ejecución" },
  { key: "pausada", label: "Pausada" },
  { key: "terminada", label: "Terminada" },
];

/** Cambiar el estado de la obra desde el encabezado, en un clic. */
export function ObraStatus({
  obraId,
  status,
  canEdit,
}: {
  obraId: string;
  status: string;
  canEdit: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = OPTIONS.find((o) => o.key === status) ?? OPTIONS[0];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!canEdit) {
    return (
      <span className="rounded-full bg-amber-500 px-3.5 py-1.5 text-sm font-semibold text-ink-950">
        {current.label}
      </span>
    );
  }

  async function change(key: string) {
    if (key === status) return setOpen(false);
    setPending(true);
    const fd = new FormData();
    fd.set("obraId", obraId);
    fd.set("status", key);
    await setObraStatus(fd);
    setPending(false);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={pending}
        className="inline-flex items-center gap-1.5 rounded-full bg-amber-500 px-3.5 py-1.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-amber-400 disabled:opacity-70"
      >
        {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
        {current.label}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-52 overflow-hidden rounded-2xl border border-ink-100 bg-white p-1.5 shadow-elevated">
          {OPTIONS.map((o) => (
            <button
              key={o.key}
              onClick={() => change(o.key)}
              className={cn(
                "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                o.key === status
                  ? "bg-amber-500/10 text-amber-700"
                  : "text-ink-700 hover:bg-ink-50"
              )}
            >
              {o.key === status ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="h-4 w-4" />
              )}
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
