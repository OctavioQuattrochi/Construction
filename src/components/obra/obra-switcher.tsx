"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Check, HardHat, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ObraOption {
  id: string;
  name: string;
  location: string | null;
}

/**
 * Selector de obra para quien tiene más de una. Deja claro cuál está viendo y
 * permite saltar a otra sin volver al listado.
 */
export function ObraSwitcher({
  current,
  obras,
}: {
  current: { id: string; name: string };
  obras: ObraOption[];
}) {
  const [open, setOpen] = useState(false);

  // Con una sola obra el selector no aporta nada: no se muestra.
  if (obras.length < 2) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex max-w-full items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-white/20"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <HardHat className="h-4 w-4 shrink-0 text-amber-400" />
        <span className="truncate">Cambiar de obra</span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <>
          {/* Capa para cerrar al tocar afuera */}
          <button
            type="button"
            aria-label="Cerrar"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div
            role="listbox"
            className="absolute right-0 z-50 mt-2 max-h-80 w-64 overflow-y-auto rounded-2xl border border-ink-100 bg-white p-1.5 shadow-elevated"
          >
            {obras.map((o) => {
              const active = o.id === current.id;
              return (
                <Link
                  key={o.id}
                  href={`/mi-obra/${o.id}`}
                  onClick={() => setOpen(false)}
                  role="option"
                  aria-selected={active}
                  className={cn(
                    "flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm transition-colors",
                    active ? "bg-amber-500/10" : "hover:bg-ink-50"
                  )}
                >
                  <Check
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0",
                      active ? "text-amber-600" : "text-transparent"
                    )}
                  />
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block truncate font-medium",
                        active ? "text-amber-700" : "text-ink-900"
                      )}
                    >
                      {o.name}
                    </span>
                    {o.location && (
                      <span className="block truncate text-xs text-ink-400">
                        {o.location}
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
            <Link
              href="/mi-obra"
              onClick={() => setOpen(false)}
              className="mt-1 flex items-center gap-2 border-t border-ink-100 px-3 py-2.5 text-sm font-medium text-ink-600 hover:text-ink-900"
            >
              <Plus className="h-4 w-4 text-amber-500" /> Ver todas / crear obra
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
