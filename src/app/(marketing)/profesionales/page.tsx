import type { Metadata } from "next";
import Link from "next/link";
import { Users, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button";
import { ProfessionalCard } from "@/components/professionals/professional-card";
import { StaggerGroup, StaggerItem } from "@/components/ui/reveal";
import { getProfessionals, getProfessions } from "@/lib/queries";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Profesionales de la construcción",
  description:
    "Encontrá arquitectos, ingenieros, maestros mayores de obra y empresas de la construcción verificados en la red de BildAp.",
};

export const dynamic = "force-dynamic";

export default async function ProfesionalesPage({
  searchParams,
}: {
  searchParams: Promise<{ p?: string }>;
}) {
  const { p } = await searchParams;
  const [professionals, professions] = await Promise.all([
    getProfessionals({ profession: p || undefined }),
    getProfessions(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Red de profesionales"
        title={
          <>
            Los profesionales que{" "}
            <span className="text-gradient-amber">tu obra necesita</span>
          </>
        }
        description="Arquitectos, ingenieros, maestros mayores de obra y empresas de la construcción. Contactá directo, sin intermediarios."
      >
        <ButtonLink href="/contacto" variant="primary">
          Quiero sumarme a la red
          <ArrowRight className="h-4 w-4" />
        </ButtonLink>
      </PageHeader>

      <section className="container-x py-12">
        {professions.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            <FilterChip href="/profesionales" active={!p}>
              Todos
            </FilterChip>
            {professions.map((prof) => (
              <FilterChip
                key={prof}
                href={`/profesionales?p=${encodeURIComponent(prof)}`}
                active={p === prof}
              >
                {prof}
              </FilterChip>
            ))}
          </div>
        )}

        {professionals.length === 0 ? (
          <EmptyState />
        ) : (
          <StaggerGroup className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {professionals.map((pro) => (
              <StaggerItem key={pro.id}>
                <ProfessionalCard pro={pro} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        )}

        {/* CTA para sumarse */}
        <div className="mt-14 overflow-hidden rounded-3xl bg-ink-950 p-8 text-white md:p-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <h2 className="font-display text-2xl font-bold">
                ¿Sos profesional o tenés una empresa constructora?
              </h2>
              <p className="mt-2 text-concrete-300">
                Sumate a la red de {site.brand} y llegá a quienes están por
                construir en {site.region}. Perfil verificado, contacto directo y
                más visibilidad para tus servicios.
              </p>
            </div>
            <ButtonLink href="/contacto" variant="primary" size="lg">
              Sumar mi perfil
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
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

function FilterChip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
        active
          ? "border-ink-900 bg-ink-900 text-white"
          : "border-ink-200 bg-white text-ink-600 hover:border-ink-400 hover:text-ink-900"
      )}
    >
      {children}
    </Link>
  );
}
