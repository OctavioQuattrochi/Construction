import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Cómo tratamos tus datos.",
};

export default function PrivacidadPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Política de privacidad" />
      <section className="container-x py-16">
        <div className="prose-article mx-auto max-w-3xl">
          <p className="md-p">
            Respetamos tu privacidad. Los datos que ingresás en el formulario de
            contacto (nombre, email, teléfono y mensaje) se utilizan
            exclusivamente para responder tu consulta y coordinar el servicio.
          </p>
          <h2 className="md-h2">Qué datos guardamos</h2>
          <ul className="md-list">
            <li>Datos de contacto que ingresás voluntariamente.</li>
            <li>El contenido de tu consulta.</li>
            <li>Fecha y hora del envío.</li>
          </ul>
          <h2 className="md-h2">Qué NO hacemos</h2>
          <p className="md-p">
            No vendemos ni compartimos tus datos con terceros con fines
            comerciales. No enviamos spam.
          </p>
          <h2 className="md-h2">Tus derechos</h2>
          <p className="md-p">
            Podés solicitar la baja o eliminación de tus datos en cualquier
            momento escribiendo a{" "}
            <a className="md-link" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
