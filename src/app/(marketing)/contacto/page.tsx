import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Clock, Phone } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { ContactForm } from "@/components/contact/contact-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contactá al estudio para consultoría, peritajes, proyectos y dirección de obra. Respondemos por email o WhatsApp.",
};

const channels = [
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Respuesta rápida",
    href: site.whatsappUrl,
    external: true,
    accent: "#25D366",
  },
  {
    icon: Mail,
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
    accent: "#f0a500",
  },
  {
    icon: MapPin,
    label: "Ubicación",
    value: site.location,
    accent: "#0b5cab",
  },
  {
    icon: Clock,
    label: "Horario",
    value: "Lun a Vie · 9 a 18 h",
    accent: "#7d7568",
  },
];

export default function ContactoPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contacto"
        title={
          <>
            Hablemos de{" "}
            <span className="text-gradient-amber">tu proyecto</span>
          </>
        }
        description="Contanos en qué estás y te ayudamos a tomar la mejor decisión técnica. Sin compromiso y con respuesta personal."
      />

      <section className="container-x -mt-4 pb-24">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr]">
          {/* Info column */}
          <div className="space-y-4">
            {channels.map((c) => {
              const Wrapper = c.href ? "a" : "div";
              return (
                <Wrapper
                  key={c.label}
                  {...(c.href
                    ? {
                        href: c.href,
                        target: c.external ? "_blank" : undefined,
                        rel: c.external ? "noopener noreferrer" : undefined,
                      }
                    : {})}
                  className="flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elevated"
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white"
                    style={{ backgroundColor: c.accent }}
                  >
                    <c.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-ink-400">{c.label}</p>
                    <p className="font-medium text-ink-900">{c.value}</p>
                  </div>
                </Wrapper>
              );
            })}

            <div className="overflow-hidden rounded-2xl border border-ink-100 bg-ink-950 p-6 text-white">
              <Phone className="h-6 w-6 text-amber-400" />
              <p className="mt-3 font-display text-lg font-semibold">
                ¿Preferís que te llamemos?
              </p>
              <p className="mt-1 text-sm text-concrete-400">
                Dejá tu teléfono en el formulario y coordinamos una llamada en el
                horario que te quede cómodo.
              </p>
            </div>
          </div>

          {/* Form */}
          <ContactForm />
        </div>
      </section>
    </>
  );
}
