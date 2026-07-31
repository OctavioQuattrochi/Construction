"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";
import type { Property } from "@prisma/client";
import { PropertyCard } from "./property-card";
import { StaggerGroup, StaggerItem } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const operations = [
  { key: "", label: "Todos" },
  { key: "venta", label: "Venta" },
  { key: "alquiler", label: "Alquiler" },
];
const types = [
  { key: "casa", label: "Casas" },
  { key: "departamento", label: "Deptos" },
  { key: "lote", label: "Lotes" },
  { key: "local", label: "Locales" },
];

// Filtrado en el cliente: instantáneo, sin navegación ni Router Cache.
export function PropertiesClient({
  properties,
  isMember,
  savedSlugs,
  initialOp = "",
  initialType = "",
}: {
  properties: Property[];
  isMember: boolean;
  savedSlugs: string[];
  initialOp?: string;
  initialType?: string;
}) {
  const [op, setOp] = useState(initialOp);
  const [type, setType] = useState(initialType);
  const savedSet = new Set(savedSlugs);

  const filtered = properties.filter(
    (p) => (!op || p.operation === op) && (!type || p.type === type)
  );

  function sync(nextOp: string, nextType: string) {
    const params = new URLSearchParams();
    if (nextOp) params.set("op", nextOp);
    if (nextType) params.set("type", nextType);
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `/inmuebles?${qs}` : "/inmuebles");
  }

  function selectOp(k: string) {
    setOp(k);
    sync(k, type);
  }
  function selectType(k: string) {
    const next = type === k ? "" : k;
    setType(next);
    sync(op, next);
  }

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {operations.map((o) => (
            <Chip key={o.key} active={op === o.key} onClick={() => selectOp(o.key)}>
              {o.label}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {types.map((t) => (
            <Chip key={t.key} active={type === t.key} subtle onClick={() => selectType(t.key)}>
              {t.label}
            </Chip>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <StaggerItem key={p.id}>
              <PropertyCard
                property={p}
                isMember={isMember}
                saved={savedSet.has(p.slug)}
              />
            </StaggerItem>
          ))}
        </StaggerGroup>
      )}
    </>
  );
}

function Chip({
  active,
  subtle,
  onClick,
  children,
}: {
  active: boolean;
  subtle?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
        active
          ? subtle
            ? "border-amber-500 bg-amber-500/10 text-amber-700"
            : "border-ink-900 bg-ink-900 text-white"
          : "border-ink-200 bg-white text-ink-600 hover:border-ink-400 hover:text-ink-900"
      )}
    >
      {children}
    </button>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-ink-200 bg-white p-12 text-center">
      <Building2 className="h-10 w-10 text-ink-300" />
      <h3 className="mt-4 font-display text-lg font-semibold text-ink-900">
        No hay inmuebles para este filtro
      </h3>
      <p className="mt-1 text-sm text-ink-500">
        Probá con otra operación o tipo de propiedad.
      </p>
    </div>
  );
}
