import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { listProviderMeta } from "@/lib/providers/registry";

// Comercios cuyos precios reúne el comparador. NO son anunciantes ni partners:
// BildAp muestra su información pública para facilitar la comparación.
export function Partners() {
  const providers = listProviderMeta();

  return (
    <section className="border-y border-ink-100 bg-white py-10">
      <div className="container-x">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
          Comparamos precios de {providers.length}+ comercios de Córdoba
        </p>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-ink-400">
          Reunimos los precios publicados de estos corralones y ferreterías para
          que compares fácil en un solo lugar.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {providers.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-2.5 rounded-2xl border border-ink-100 bg-concrete-50 px-5 py-3 transition-colors hover:border-ink-200"
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white"
                style={{ backgroundColor: p.logoColor }}
              >
                {p.name.slice(0, 2).toUpperCase()}
              </span>
              <span className="font-display text-sm font-semibold text-ink-700">
                {p.name}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/comparador"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:underline"
          >
            Comparar precios ahora <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
