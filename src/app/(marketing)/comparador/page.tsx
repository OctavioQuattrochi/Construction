import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ComparatorClient } from "@/components/comparator/comparator-client";
import { PriceIndexSection } from "@/components/comparator/price-index-section";
import { listProviderMeta } from "@/lib/providers/registry";
import { Dot } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Comparador de precios de materiales",
  description:
    "Compará precios de materiales de construcción entre proveedores de Córdoba y Argentina: cemento, hierro, ladrillos, pintura y más.",
};

export default function ComparadorPage() {
  const providers = listProviderMeta();

  return (
    <>
      <PageHeader
        brandLarge
        eyebrow="Comparador de precios"
        title={
          <>
            El precio real de tus materiales,{" "}
            <span className="text-gradient-amber">en un solo lugar</span>
          </>
        }
        description="Consultamos múltiples proveedores para que compares precio, marca, presentación y disponibilidad antes de comprar. Ideal para armar tu presupuesto con datos reales."
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-concrete-400">Proveedores integrados:</span>
          {providers.map((p) => (
            <span
              key={p.id}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-concrete-200"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: p.logoColor }}
              />
              {p.name}
            </span>
          ))}
        </div>
      </PageHeader>

      <section className="container-x -mt-8 pb-24">
        <ComparatorClient />

        <div className="mt-12 flex items-start gap-3 rounded-2xl border border-ink-100 bg-concrete-50 p-5 text-sm text-ink-500">
          <Dot color="#f0a500" />
          <p>
            Los proveedores marcados <strong className="font-semibold text-emerald-600">En vivo</strong>{" "}
            traen el precio en tiempo real desde su sitio. Los marcados{" "}
            <strong className="font-semibold text-ink-600">Referencia</strong> muestran un valor
            estimado (integración en vivo pendiente). En todos los casos, confirmá
            el precio y la disponibilidad en el sitio del proveedor antes de
            comprar. La fecha de obtención se indica en cada búsqueda.
          </p>
        </div>
      </section>

      <PriceIndexSection />
    </>
  );
}
