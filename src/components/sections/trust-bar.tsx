import { ShieldCheck, Clock, FileCheck2, HandCoins } from "lucide-react";

const marquee = [
  "Dirección de obra",
  "Peritajes técnicos",
  "Hormigón armado",
  "Impermeabilización",
  "Presupuestos",
  "Ampliaciones",
  "Trámites municipales",
  "Refacciones",
  "Diseño de interiores",
  "Estructuras",
];

const guarantees = [
  { icon: ShieldCheck, title: "Respaldo profesional", desc: "Matrícula y firma" },
  { icon: Clock, title: "40+ años", desc: "de trayectoria real" },
  { icon: FileCheck2, title: "Informes válidos", desc: "compraventa y seguros" },
  { icon: HandCoins, title: "Cuidamos tu plata", desc: "sin sobrecostos" },
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
            className="flex items-center gap-3 bg-white px-5 py-6"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <g.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-sm font-semibold text-ink-900">
                {g.title}
              </p>
              <p className="text-xs text-ink-400">{g.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
