import {
  BarChart3,
  Wallet,
  Package,
  NotebookPen,
  Users,
  TrendingUp,
  Check,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Section, SectionHeading } from "@/components/ui/section";
import { ButtonLink } from "@/components/ui/button";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/reveal";

const FEATURES = [
  {
    icon: BarChart3,
    title: "Avance por etapa",
    desc: "Cada etapa de la obra con su porcentaje real. Tildás las tareas que se hicieron y el avance se calcula solo.",
  },
  {
    icon: Wallet,
    title: "Presupuesto y gastos",
    desc: "Repartís el total entre las etapas, registrás cada gasto y ves al instante si estás gastando más rápido de lo que avanzás.",
  },
  {
    icon: Package,
    title: "Materiales",
    desc: "Qué falta comprar, qué ya llegó y a qué precio. Se cargan desde las calculadoras o el comparador, sin volver a escribir nada.",
  },
  {
    icon: NotebookPen,
    title: "Libro de obra",
    desc: "Qué se hizo cada día, con fotos. Queda el registro de toda la obra, que después sirve como respaldo.",
  },
  {
    icon: Users,
    title: "Compartida con roles",
    desc: "El profesional carga los avances y el propietario los ve al día. Cada uno con sus permisos.",
  },
  {
    icon: TrendingUp,
    title: "Ajustes por inflación",
    desc: "El presupuesto original queda congelado y cada aumento se registra con su motivo. Siempre sabés por qué subió.",
  },
];

/**
 * Portada pública de Mi Obra.
 *
 * Se muestra a quien todavía no inició sesión: antes, /mi-obra mandaba directo
 * al login sin explicar qué era, y quien llegaba desde la home se encontraba
 * pidiéndole la cuenta de Google a ciegas. Los buscadores ven siempre esta
 * versión (nunca tienen sesión), así que además es la página indexable de la
 * sección.
 */
export function MiObraLanding() {
  return (
    <>
      <PageHeader
        eyebrow="Mi obra"
        title={
          <>
            Tu obra, <span className="text-gradient-amber">bajo control</span>
          </>
        }
        description="Presupuesto, avance, gastos, materiales y libro de obra en un solo lugar. El profesional carga los datos y el propietario los ve al día, desde el celular."
      >
        <div className="flex flex-wrap items-center gap-3">
          <ButtonLink href="/ingresar" size="lg" variant="primary">
            Crear mi obra gratis
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
          <span className="text-sm text-concrete-400">
            Gratis · Entrás con tu cuenta de Google
          </span>
        </div>
      </PageHeader>

      {/* Qué incluye */}
      <Section>
        <SectionHeading
          eyebrow="Qué incluye"
          title="Todo lo que pasa en la obra, en un mismo lugar"
          description="Sin planillas sueltas, sin grupos de WhatsApp donde se pierde la información."
        />
        <StaggerGroup className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <StaggerItem key={f.title}>
              <article className="card h-full p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-900 text-amber-400">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-ink-900">
                  {f.title}
                </h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-500">
                  {f.desc}
                </p>
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Section>

      {/* Cómo funciona compartida: es la diferencia real */}
      <Section className="bg-ink-950">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionHeading
              light
              eyebrow="Compartida"
              title="El que dirige carga. El dueño mira."
              description="La obra se comparte por email. Cada persona entra con su cuenta y ve exactamente lo que le corresponde."
            />
            <ButtonLink
              href="/ingresar"
              variant="primary"
              className="mt-8 inline-flex"
            >
              Empezar ahora
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="grid gap-4">
              {[
                {
                  role: "Profesional a cargo",
                  tag: "Carga los datos",
                  items: [
                    "Actualiza el avance de cada etapa",
                    "Registra gastos y materiales",
                    "Sube fotos al libro de obra",
                    "Propone cambios de presupuesto",
                  ],
                },
                {
                  role: "Propietario",
                  tag: "Ve todo al día",
                  items: [
                    "Avance real sin tener que preguntar",
                    "En qué se fue la plata, gasto por gasto",
                    "Fotos de cómo va la obra",
                    "Aprueba los cambios que impliquen más costo",
                  ],
                },
              ].map((c) => (
                <div
                  key={c.role}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-display font-semibold text-white">
                      {c.role}
                    </h3>
                    <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-400">
                      {c.tag}
                    </span>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {c.items.map((it) => (
                      <li
                        key={it}
                        className="flex items-start gap-2.5 text-sm text-concrete-300"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Inflación: el problema argentino */}
      <Section className="bg-concrete-50">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <Reveal>
            <SectionHeading
              eyebrow="El problema argentino"
              title="¿Subió por inflación o porque pediste cambios?"
              description="Es la pregunta que arruina obras y relaciones. Mi Obra la responde sola: el presupuesto original se congela como línea base y cada aumento queda registrado con su motivo."
            />
            <p className="mt-6 text-[0.95rem] leading-relaxed text-ink-500">
              Para la parte de inflación usamos el histórico real de precios de
              materiales del comparador de BildAp, no un índice general. Son los
              precios de los proveedores de Córdoba, que es lo que efectivamente
              pagás.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="card p-7">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                Ejemplo
              </p>
              <div className="mt-5 space-y-3.5">
                {[
                  { l: "Presupuesto original", v: "$ 24.000.000", muted: true },
                  { l: "Por variación de precios", v: "+ $ 3.120.000" },
                  { l: "Cambios que pediste", v: "+ $ 1.450.000" },
                ].map((r) => (
                  <div
                    key={r.l}
                    className="flex items-center justify-between gap-4 text-sm"
                  >
                    <span className="text-ink-500">{r.l}</span>
                    <span
                      className={
                        r.muted
                          ? "font-display font-semibold text-ink-500"
                          : "font-display font-semibold text-amber-600"
                      }
                    >
                      {r.v}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between gap-4 border-t border-ink-100 pt-3.5">
                  <span className="font-display font-semibold text-ink-900">
                    Presupuesto actualizado
                  </span>
                  <span className="font-display text-lg font-bold text-ink-900">
                    $ 28.570.000
                  </span>
                </div>
              </div>
              <p className="mt-5 text-xs leading-relaxed text-ink-400">
                Valores de ejemplo para mostrar cómo se presenta la información.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Cierre */}
      <Section>
        <div className="rounded-3xl bg-ink-950 px-8 py-14 text-center md:px-16 md:py-20">
          <Reveal>
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
              Empezá a llevar tu obra como se debe
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-concrete-300">
              Es gratis. Creás la obra en un minuto y ya podés cargar el
              presupuesto, los materiales y el avance.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/ingresar" size="lg" variant="primary">
                Crear mi obra gratis
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/calculadoras" size="lg" variant="dark">
                Probar las calculadoras
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
