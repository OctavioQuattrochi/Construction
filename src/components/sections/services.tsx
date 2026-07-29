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

export function Services({ services }: { services: ServiceView[] }) {
  return (
    <Section id="servicios" className="bg-concrete-50">
      <SectionHeading
        eyebrow="Servicios profesionales"
        title="Todo lo que tu obra necesita, con respaldo técnico"
        description="Un solo estudio para acompañarte en cada etapa: desde la idea inicial hasta la entrega final de la obra."
      />

      <StaggerGroup className="mt-14 grid gap-6 md:grid-cols-2">
        {services.map((s) => (
          <StaggerItem key={s.slug}>
            <article className="card card-hover group h-full p-8">
              <div className="flex items-start justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-900 text-amber-400 transition-transform duration-500 ease-premium group-hover:scale-105 group-hover:bg-amber-500 group-hover:text-ink-950">
                  <DynamicIcon name={s.icon} className="h-7 w-7" />
                </div>
                <ArrowUpRight className="h-5 w-5 text-ink-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-amber-500" />
              </div>

              <h3 className="mt-6 font-display text-xl font-semibold text-ink-900">
                {s.title}
              </h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-500">
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
            </article>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </Section>
  );
}
