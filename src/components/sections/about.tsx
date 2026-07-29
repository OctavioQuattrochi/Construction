import Image from "next/image";
import { Award, Check, Quote } from "lucide-react";
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
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80"
                alt={`${site.owner}, arquitecto`}
                width={1200}
                height={1400}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950/80 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3 rounded-2xl glass-dark p-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-ink-950">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display font-semibold text-white">
                    {site.owner}
                  </p>
                  <p className="text-sm text-concrete-300">{site.ownerTitle}</p>
                </div>
              </div>
            </div>

            {/* floating years badge */}
            <div className="absolute -right-4 -top-4 flex h-24 w-24 flex-col items-center justify-center rounded-3xl bg-ink-900 text-white shadow-elevated md:h-28 md:w-28">
              <span className="font-display text-3xl font-bold text-amber-400 md:text-4xl">
                {aboutBio.years}
              </span>
              <span className="text-[0.6rem] uppercase tracking-widest text-concrete-400">
                años
              </span>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <span className="eyebrow">
              <span className="h-px w-6 bg-amber-500/60" />
              Sobre el estudio
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-4 text-3xl font-bold leading-[1.12] text-gradient sm:text-4xl md:text-[2.6rem]">
              Cuatro décadas resolviendo obras del mundo real
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-lg leading-relaxed text-ink-500">
              {site.owner} es arquitecto con más de {aboutBio.years} años de
              trayectoria en proyecto, dirección y peritaje de obras. Su enfoque
              combina rigor técnico con una comunicación clara: explicar cada
              decisión para que el cliente entienda qué está construyendo y por
              qué.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {aboutBio.highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-start gap-3 rounded-2xl border border-ink-100 bg-white p-4 text-sm text-ink-700 shadow-soft"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-600">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.2}>
            <figure className="mt-8 rounded-2xl border-l-2 border-amber-500 bg-concrete-50 p-6">
              <Quote className="h-6 w-6 text-amber-500" />
              <blockquote className="mt-3 font-display text-lg italic leading-relaxed text-ink-800">
                “La mejor obra no es la más cara ni la más rápida: es la que se
                piensa antes de empezar.”
              </blockquote>
              <figcaption className="mt-3 text-sm font-medium text-ink-500">
                — {site.owner}
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
