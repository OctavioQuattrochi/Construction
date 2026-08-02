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
            Respetamos tu privacidad. Tratamos tus datos personales de acuerdo con
            la <strong>Ley 25.326 de Protección de Datos Personales</strong> de la
            República Argentina. Los datos que ingresás se utilizan exclusivamente
            para los fines descriptos abajo.
          </p>
          <h2 className="md-h2">Qué datos guardamos</h2>
          <ul className="md-list">
            <li>
              <strong>Contacto:</strong> nombre, email, teléfono y el contenido de
              tu consulta, para responderte y coordinar el servicio.
            </li>
            <li>
              <strong>Newsletter:</strong> tu email, si te suscribís, para enviarte
              novedades. Podés darte de baja cuando quieras.
            </li>
            <li>
              <strong>Cuenta con Google:</strong> si iniciás sesión, guardamos tu
              nombre, email y foto de perfil para identificarte y mostrarte tus
              favoritos y presupuestos guardados.
            </li>
            <li>
              <strong>Uso del sitio:</strong> métricas anónimas de navegación
              (Google Analytics) para mejorar la plataforma. No te identifican
              personalmente.
            </li>
          </ul>
          <h2 className="md-h2">Qué NO hacemos</h2>
          <p className="md-p">
            No vendemos ni compartimos tus datos con terceros con fines
            comerciales. No enviamos spam.
          </p>
          <h2 className="md-h2">Tus derechos</h2>
          <p className="md-p">
            Conforme a la Ley 25.326, podés acceder, rectificar, actualizar o
            solicitar la eliminación de tus datos en cualquier momento escribiendo
            a{" "}
            <a className="md-link" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            . La <strong>Agencia de Acceso a la Información Pública</strong>, órgano
            de control de la Ley 25.326, atiende las denuncias por incumplimiento.
          </p>
        </div>
      </section>
    </>
  );
}
