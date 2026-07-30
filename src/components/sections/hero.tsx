"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calculator,
  ScanBarcode,
  Users,
  Building2,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Dot } from "@/components/ui/badge";
import { site } from "@/lib/site";

const ease = [0.22, 1, 0.36, 1] as const;

const stats = [
  { value: "+40", label: "Materiales en el comparador" },
  { value: "+8", label: "Calculadoras de obra" },
  { value: "24/7", label: "Acceso libre y gratuito" },
];

const platformFeatures = [
  { icon: ScanBarcode, label: "Comparador de precios" },
  { icon: Calculator, label: "Calculadoras de obra" },
  { icon: Users, label: "Red de profesionales" },
  { icon: Building2, label: "Inmuebles" },
];

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink-950 pt-20">
      {/* Background image + overlays */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2400&q=80"
          alt="Estructura arquitectónica moderna"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-ink-950/60 to-ink-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/50 to-transparent" />
        <div className="absolute inset-0 bg-grid-light bg-[size:64px_64px] opacity-20" />
        <div className="absolute inset-0 bg-radial-amber" />
      </div>

      <div className="container-x relative z-10 grid w-full items-center gap-12 py-16 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-concrete-200 backdrop-blur-md"
          >
            <Dot color="#f0a500" />
            {site.companyTagline} · {site.region}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.08 }}
            className="mt-6 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[4.1rem]"
          >
            Todo para{" "}
            <span className="text-gradient-amber">construir mejor</span>, en un
            solo lugar.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.16 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-concrete-300"
          >
            BildAp reúne guías técnicas, calculadoras de materiales, comparación
            de precios entre proveedores, una red de profesionales asociados e
            inmuebles. La plataforma de referencia para tomar decisiones de
            construcción en {site.region} y toda Argentina.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.24 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <ButtonLink href="/comparador" size="lg" variant="primary">
              Comparar precios
              <ArrowRight className="h-5 w-5" />
            </ButtonLink>
            <ButtonLink href="/calculadoras" size="lg" variant="dark">
              <Calculator className="h-5 w-5" />
              Calcular materiales
            </ButtonLink>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.34 }}
            className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-3xl font-bold text-white md:text-4xl">
                  {s.value}
                </dt>
                <dd className="mt-1 text-xs text-concrete-400 sm:text-sm">
                  {s.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* Floating platform card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease, delay: 0.3 }}
          className="hidden lg:block"
        >
          <div className="relative animate-float">
            <div className="glass-dark rounded-4xl p-7 shadow-elevated">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-ink-950">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-display font-semibold text-white">
                    Una sola plataforma
                  </p>
                  <p className="text-sm text-concrete-400">
                    Todo tu proyecto, integrado
                  </p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-concrete-300">
                Planificá, presupuestá, compará precios y encontrá a los
                profesionales indicados sin salir de BildAp.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {platformFeatures.map((f) => (
                  <div
                    key={f.label}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-concrete-200"
                  >
                    <f.icon className="h-3.5 w-3.5 text-amber-400" />
                    {f.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block"
      >
        <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/25 p-1.5">
          <motion.span
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="h-2 w-1 rounded-full bg-amber-400"
          />
        </div>
      </motion.div>
    </section>
  );
}
