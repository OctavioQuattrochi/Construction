import type { Metadata } from "next";
import Link from "next/link";
import { Building2, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button";
import { PropertyCard } from "@/components/properties/property-card";
import { StaggerGroup, StaggerItem } from "@/components/ui/reveal";
import { getProperties, getSavedRefIds } from "@/lib/queries";
import { getMemberSession } from "@/lib/member-auth";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Inmuebles",
  description:
    "Casas, departamentos, lotes y locales en venta y alquiler publicados por constructoras e inmobiliarias en BildAp.",
};

export const dynamic = "force-dynamic";

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

export default async function InmueblesPage({
  searchParams,
}: {
  searchParams: Promise<{ op?: string; type?: string }>;
}) {
  const { op, type } = await searchParams;
  const [properties, member] = await Promise.all([
    getProperties({ operation: op || undefined, type: type || undefined }),
    getMemberSession(),
  ]);
  const saved = member
    ? await getSavedRefIds(member.id, "property")
    : new Set<string>();

  return (
    <>
      <PageHeader
        eyebrow="Servicio inmobiliario"
        title={
          <>
            Inmuebles de{" "}
            <span className="text-gradient-amber">constructoras e inmobiliarias</span>
          </>
        }
        description="Casas, departamentos, lotes y locales en venta y alquiler. Publicados por empresas verificadas de la red BildAp."
      >
        <ButtonLink href="/contacto" variant="primary">
          Publicar un inmueble
          <ArrowRight className="h-4 w-4" />
        </ButtonLink>
      </PageHeader>

      <section className="container-x py-12">
        {/* Filtros */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {operations.map((o) => (
              <Chip
                key={o.key}
                href={buildHref(o.key, type)}
                active={(op || "") === o.key}
              >
                {o.label}
              </Chip>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {types.map((t) => (
              <Chip
                key={t.key}
                href={buildHref(op, (type || "") === t.key ? "" : t.key)}
                active={type === t.key}
                subtle
              >
                {t.label}
              </Chip>
            ))}
          </div>
        </div>

        {properties.length === 0 ? (
          <EmptyState />
        ) : (
          <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
              <StaggerItem key={p.id}>
                <PropertyCard
                  property={p}
                  isMember={Boolean(member)}
                  saved={saved.has(p.slug)}
                />
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}

        <div className="mt-14 overflow-hidden rounded-3xl bg-ink-950 p-8 text-white md:p-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <h2 className="font-display text-2xl font-bold">
                ¿Sos inmobiliaria o desarrollista?
              </h2>
              <p className="mt-2 text-concrete-300">
                Publicá tus inmuebles en {site.brand} y llegá a una audiencia que
                está construyendo, invirtiendo y buscando propiedades.
              </p>
            </div>
            <ButtonLink href="/contacto" variant="primary" size="lg">
              Publicar inmuebles
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}

function buildHref(op?: string, type?: string) {
  const params = new URLSearchParams();
  if (op) params.set("op", op);
  if (type) params.set("type", type);
  const qs = params.toString();
  return `/inmuebles${qs ? `?${qs}` : ""}`;
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

function Chip({
  href,
  active,
  subtle,
  children,
}: {
  href: string;
  active: boolean;
  subtle?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
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
    </Link>
  );
}
