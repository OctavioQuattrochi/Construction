import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button";
import { ProfessionalsClient } from "@/components/professionals/professionals-client";
import { getProfessionals, getProfessions, getSavedRefIds } from "@/lib/queries";
import { getMemberSession } from "@/lib/member-auth";
import { site } from "@/lib/site";

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
  const [professionals, professions, member] = await Promise.all([
    getProfessionals(), // todos; el filtrado es en el cliente
    getProfessions(),
    getMemberSession(),
  ]);
  const saved = member
    ? await getSavedRefIds(member.id, "professional")
    : new Set<string>();

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
        <ProfessionalsClient
          professionals={professionals}
          professions={professions}
          isMember={Boolean(member)}
          savedSlugs={[...saved]}
          initialProfession={p || ""}
        />

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
