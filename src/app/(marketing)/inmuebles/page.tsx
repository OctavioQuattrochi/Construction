import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { ButtonLink } from "@/components/ui/button";
import { PropertiesClient } from "@/components/properties/properties-client";
import { getProperties, getSavedRefIds } from "@/lib/queries";
import { getMemberSession } from "@/lib/member-auth";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Inmuebles",
  description:
    "Casas, departamentos, lotes y locales en venta y alquiler publicados por constructoras e inmobiliarias en BildAp.",
};

export const dynamic = "force-dynamic";

export default async function InmueblesPage({
  searchParams,
}: {
  searchParams: Promise<{ op?: string; type?: string }>;
}) {
  const { op, type } = await searchParams;
  const [properties, member] = await Promise.all([
    getProperties(), // todos; el filtrado es en el cliente
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
        <PropertiesClient
          properties={properties}
          isMember={Boolean(member)}
          savedSlugs={[...saved]}
          initialOp={op || ""}
          initialType={type || ""}
        />

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
