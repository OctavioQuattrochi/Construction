import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { StaggerGroup, StaggerItem } from "@/components/ui/reveal";
import { DynamicIcon } from "@/components/ui/icon";
import { toList } from "@/lib/utils";

export interface ServiceView {
  title: string;
  slug: string;
  icon: string;
  summary: string;
  description: string;
  features: string;
}

/**
 * Cada solución se apoya en una herramienta concreta de la plataforma: eso es
 * lo que diferencia a BildAp de una página de servicios profesionales.
 */
const TOOL: Record<string, { href: string; label: string }> = {
  "proyecto-y-planificacion": {
    href: "/calculadoras",
    label: "Calculá los materiales",
  },
  "control-y-seguimiento": { href: "/mi-obra", label: "Abrir Mi Obra" },
  asesoramiento: { href: "/comparador", label: "Comparar precios reales" },
  "inspeccion-y-diagnostico": {
    href: "/contacto",
    label: "Pedir una inspección",
  },
};

export function Services({ services }: { services: ServiceView[] }) {
  return (
    <Section id="servicios" className="bg-concrete-50">
      <SectionHeading
        eyebrow="Soluciones para tu obra"
        title="Todo lo que necesitás para construir mejor"
        description="Información, herramientas y respaldo profesional para ayudarte en cada etapa de tu obra."
      />

      <StaggerGroup className="mt-14 grid gap-6 md:grid-cols-2">
        {services.map((s) => {
          const tool = TOOL[s.slug];
          return (
            <StaggerItem key={s.slug}>
              <article className="card card-hover group relative flex h-full flex-col p-8">
                <div className="flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-900 text-amber-400 transition-transform duration-500 ease-premium group-hover:scale-105 group-hover:bg-amber-500 group-hover:text-ink-950">
                    <DynamicIcon name={s.icon} className="h-7 w-7" />
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-ink-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-amber-500" />
                </div>

                <h3 className="mt-6 font-display text-xl font-semibold text-ink-900">
                  {s.title}
                </h3>
                {/* La promesa corta: lo que el usuario se lleva de esta solución. */}
                <p className="mt-1.5 font-display text-[0.95rem] font-medium text-amber-600">
                  {s.summary}
                </p>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-500">
                  {s.description}
                </p>

                <ul className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {toList(s.features, "|").map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-ink-600"
                    >
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-600">
                        <Check className="h-3 w-3" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                {tool && (
                  <Link
                    href={tool.href}
                    // mt-auto: alinea el link abajo aunque las tarjetas tengan
                    // distinta cantidad de items.
                    // after:absolute inset-0 estira el area clickeable a
                    // toda la tarjeta (la flecha de arriba ya lo insinuaba),
                    // sin anidar la lista dentro de un <a>.
                    className="mt-auto inline-flex items-center gap-1.5 self-start border-b border-transparent pt-7 font-display text-sm font-semibold text-ink-900 transition-colors after:absolute after:inset-0 after:content-[''] hover:border-amber-500 hover:text-amber-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                  >
                    {tool.label}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                )}
              </article>
            </StaggerItem>
          );
        })}
      </StaggerGroup>
    </Section>
  );
}
