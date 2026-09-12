import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ComparatorClient } from "@/components/comparator/comparator-client";
import { PriceIndexSection } from "@/components/comparator/price-index-section";
import { Dot } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Comparador de precios de materiales",
  description:
    "Compará precios de materiales de construcción entre proveedores de Córdoba y Argentina: cemento, hierro, ladrillos, pintura y más.",
};

export default function ComparadorPage() {
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
        description="Traemos precios en vivo desde los sitios de varios proveedores y valores de referencia del resto. Compará precio, presentación y disponibilidad antes de comprar."
      >
        {/* El comparador no es un directorio de proveedores: el comercio se
            descubre dentro del resultado del producto que se busca. Acá sólo
            se comunica el alcance, sin enumerarlos. */}
        <p className="text-sm text-concrete-400">
          Buscá un material y compará precio, presentación y disponibilidad
          entre corralones y ferreterías de Córdoba y Argentina.
        </p>
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
