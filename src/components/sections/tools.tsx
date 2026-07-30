import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  ScanBarcode,
  BookOpen,
  Users,
  Building2,
} from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { StaggerGroup, StaggerItem } from "@/components/ui/reveal";

const tools = [
  {
    href: "/comparador",
    icon: ScanBarcode,
    title: "Comparador de precios",
    desc: "Compará el precio de materiales entre proveedores de Córdoba y Argentina en un solo lugar.",
    tag: "Destacado",
    accent: "from-amber-500/20",
  },
  {
    href: "/calculadoras",
    icon: Calculator,
    title: "Calculadoras de obra",
    desc: "Hormigón, ladrillos, mortero, pintura, membrana y más. Estimá materiales al instante.",
    tag: "8 herramientas",
    accent: "from-blue-500/20",
  },
  {
    href: "/conocimiento",
    icon: BookOpen,
    title: "Centro de conocimiento",
    desc: "Artículos técnicos y guías prácticas para construir mejor y evitar errores costosos.",
    tag: "Aprendé",
    accent: "from-emerald-500/20",
  },
  {
    href: "/profesionales",
    icon: Users,
    title: "Red de profesionales",
    desc: "Encontrá arquitectos, ingenieros y maestros mayores de obra verificados. Contacto directo.",
    tag: "Comunidad",
    accent: "from-purple-500/20",
  },
  {
    href: "/inmuebles",
    icon: Building2,
    title: "Inmuebles",
    desc: "Casas, departamentos y lotes en venta y alquiler publicados por empresas de la red.",
    tag: "Nuevo",
    accent: "from-rose-500/20",
  },
];

export function Tools() {
  return (
    <Section className="relative overflow-hidden bg-ink-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-grid-light bg-[size:60px_60px] opacity-20" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="relative">
        <SectionHeading
          light
          align="center"
          eyebrow="Todo BildAp"
          title="Una plataforma, todo tu proyecto"
          description="Herramientas, información y comunidad para que planifiques, presupuestes, compres y construyas mejor — sin necesidad de ser un experto."
        />

        <StaggerGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <StaggerItem key={t.href}>
              <Link
                href={t.href}
                className="group relative block h-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition-all duration-500 ease-premium hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06]"
              >
                <div
                  className={`pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br ${t.accent} to-transparent opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`}
                />
                <div className="relative flex items-center justify-between">
                  <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-white/10 p-3 text-amber-400 transition-colors group-hover:bg-amber-500 group-hover:text-ink-950">
                    <t.icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-wide text-concrete-300">
                    {t.tag}
                  </span>
                </div>
                <h3 className="relative mt-6 font-display text-xl font-semibold text-white">
                  {t.title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-concrete-400">
                  {t.desc}
                </p>
                <span className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-amber-400">
                  Explorar
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </Section>
  );
}
