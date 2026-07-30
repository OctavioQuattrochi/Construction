import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Términos de uso de la plataforma.",
};

export default function TerminosPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Términos y condiciones" />
      <section className="container-x py-16">
        <div className="prose-article mx-auto max-w-3xl">
          <p className="md-p">
            El uso de esta plataforma implica la aceptación de los presentes
            términos. El contenido, las calculadoras y el comparador de precios
            tienen carácter orientativo y no reemplazan el asesoramiento
            profesional específico para cada obra.
          </p>
          <h2 className="md-h2">Herramientas de estimación</h2>
          <p className="md-p">
            Las calculadoras de materiales utilizan dosificaciones y rendimientos
            estándar de la construcción. Los resultados son estimaciones. Para
            obras con responsabilidad estructural, deben ser validadas por un
            profesional matriculado.
          </p>
          <h2 className="md-h2">Comparador de precios</h2>
          <p className="md-p">
            Los precios mostrados son de referencia, provienen de distintas
            fuentes y pueden diferir del valor final del proveedor. Siempre debe
            confirmarse el precio y la disponibilidad directamente con el
            proveedor antes de comprar. Cada resultado indica su fecha de
            obtención.
          </p>
          <h2 className="md-h2">Consultas profesionales</h2>
          <p className="md-p">
            El envío de una consulta no genera obligación contractual. El alcance
            de cada servicio se acuerda de forma particular con el equipo de{" "}
            {site.company}.
          </p>
        </div>
      </section>
    </>
  );
}
