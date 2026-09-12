import { BookOpenCheck, Calculator, LifeBuoy, HandCoins } from "lucide-react";

const marquee = [
  "Calculadoras de materiales",
  "Precios reales de proveedores",
  "Seguimiento de obra",
  "Presupuestos",
  "Guías para construir",
  "Comparación de materiales",
  "Control de gastos",
  "Ampliaciones y reformas",
  "Humedades y patologías",
  "Trámites municipales",
];

const guarantees = [
  {
    icon: BookOpenCheck,
    title: "Información confiable",
    desc: "para decidir mejor antes de construir",
  },
  {
    icon: Calculator,
    title: "Herramientas prácticas",
    desc: "calculadoras y recursos para tu obra",
  },
  {
    icon: LifeBuoy,
    title: "Respaldo profesional",
    desc: "cuando necesitás asistencia especializada",
  },
  {
    icon: HandCoins,
    title: "Control de costos",
    desc: "para evitar gastos y errores innecesarios",
  },
];

export function TrustBar() {
  return (
    <section className="border-y border-ink-100 bg-white">
      {/* marquee */}
      <div className="relative overflow-hidden py-5">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-white to-transparent" />
        <div className="flex w-max animate-marquee gap-10">
          {[...marquee, ...marquee].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-3 whitespace-nowrap font-display text-sm font-medium uppercase tracking-wide text-ink-400"
            >
              {item}
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            </span>
          ))}
        </div>
      </div>

      {/* guarantees */}
      <div className="container-x grid grid-cols-2 gap-px overflow-hidden border-t border-ink-100 bg-ink-100 md:grid-cols-4">
        {guarantees.map((g) => (
          <div
            key={g.title}
            className="flex items-start gap-3 bg-white px-5 py-6"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <g.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-sm font-semibold text-ink-900">
                {g.title}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-400">{g.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
