import Image from "next/image";
import { Building2, Check, Quote } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { aboutBio } from "@/lib/content";
import { site } from "@/lib/site";

export function About() {
  return (
    <Section id="sobre">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <Reveal>
          <div className="relative">
            <div className="absolute -inset-3 -z-10 rounded-[2.2rem] bg-gradient-to-br from-amber-500/20 to-transparent blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-ink-100 shadow-elevated">
              <Image
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80"
                alt="Equipo y obra de BildAp"
                width={1200}
                height={1400}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950/80 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3 rounded-2xl glass-dark p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-ink-950">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display font-semibold text-white">
                    {site.company}
                  </p>
                  <p className="text-sm text-concrete-300">
                    {site.companyTagline}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </Reveal>

        <div>
          <Reveal>
            <span className="eyebrow">
              <span className="h-px w-6 bg-amber-500/60" />
              Sobre BildAp
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            {/* La frase que define el producto: BildAp no ejecuta la obra,
                te da con qué decidir mejor en cada etapa. */}
            <h2 className="mt-4 text-3xl font-bold leading-[1.12] text-gradient sm:text-4xl md:text-[2.6rem]">
              BildAp no construye por vos.
              <br />
              Te ayuda a construir mejor.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-lg leading-relaxed text-ink-500">
              {site.company} nace para ordenar y transparentar las decisiones de
              obra. Combinamos tecnología con el respaldo de una red de
              profesionales de la construcción —arquitectos, ingenieros y
              maestros mayores de obra— para que planifiques, presupuestes y
              construyas con información real y acompañamiento experto.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {aboutBio.pillars.map((p) => (
                <div
                  key={p.title}
                  className="rounded-2xl border border-ink-100 bg-white p-5 shadow-soft"
                >
                  <p className="font-display font-semibold text-ink-900">
                    {p.title}
                  </p>
                  <p className="mt-1 text-sm text-ink-500">{p.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {aboutBio.highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-3 text-sm text-ink-700"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-600">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.25}>
            <figure className="mt-8 rounded-2xl border-l-2 border-amber-500 bg-concrete-50 p-6">
              <Quote className="h-6 w-6 text-amber-500" />
              <blockquote className="mt-3 font-display text-lg italic leading-relaxed text-ink-800">
                “La mejor obra no es la más cara ni la más rápida: es la que se
                piensa antes de empezar.”
              </blockquote>
              <figcaption className="mt-3 text-sm font-medium text-ink-500">
                — {site.brand}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
