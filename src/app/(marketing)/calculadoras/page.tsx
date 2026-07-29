import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { CalculatorsClient } from "@/components/calculators/calculators-client";

export const metadata: Metadata = {
  title: "Calculadoras de construcción",
  description:
    "Calculadoras de materiales: hormigón, ladrillos, mortero, pintura y pisos. Estimá cuánto material necesitás para tu obra al instante.",
};

export default function CalculadorasPage() {
  return (
    <>
      <PageHeader
        eyebrow="Calculadoras de obra"
        title={
          <>
            Estimá tus materiales{" "}
            <span className="text-gradient-amber">en segundos</span>
          </>
        }
        description="Herramientas prácticas para planificar y presupuestar. Ingresá las medidas de tu obra y obtené la cantidad de materiales estimada al instante."
      />

      <section className="container-x -mt-6 pb-24">
        <CalculatorsClient />
      </section>
    </>
  );
}
