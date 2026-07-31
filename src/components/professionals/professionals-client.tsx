"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import type { Professional } from "@prisma/client";
import { ProfessionalCard } from "./professional-card";
import { StaggerGroup, StaggerItem } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

// Filtrado en el cliente: instantáneo, sin navegación ni Router Cache.
// Sincroniza la URL con history.replaceState para deep-links compartibles.
export function ProfessionalsClient({
  professionals,
  professions,
  isMember,
  savedSlugs,
  initialProfession = "",
}: {
  professionals: Professional[];
  professions: string[];
  isMember: boolean;
  savedSlugs: string[];
  initialProfession?: string;
}) {
  const [active, setActive] = useState(initialProfession);
  const savedSet = new Set(savedSlugs);

  const filtered = active
    ? professionals.filter((p) => p.profession === active)
    : professionals;

  function select(prof: string) {
    setActive(prof);
    const url = prof
      ? `/profesionales?p=${encodeURIComponent(prof)}`
      : "/profesionales";
    window.history.replaceState(null, "", url);
  }

  return (
    <>
      {professions.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <Chip active={!active} onClick={() => select("")}>
            Todos
          </Chip>
          {professions.map((prof) => (
            <Chip key={prof} active={active === prof} onClick={() => select(prof)}>
              {prof}
            </Chip>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((pro) => (
            <StaggerItem key={pro.id}>
              <ProfessionalCard
                pro={pro}
                isMember={isMember}
                saved={savedSet.has(pro.slug)}
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
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
        active
          ? "border-ink-900 bg-ink-900 text-white"
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
      <Users className="h-10 w-10 text-ink-300" />
      <h3 className="mt-4 font-display text-lg font-semibold text-ink-900">
        Todavía no hay profesionales en esta categoría
      </h3>
      <p className="mt-1 text-sm text-ink-500">
        Estamos sumando profesionales a la red. Volvé pronto.
      </p>
    </div>
  );
}
