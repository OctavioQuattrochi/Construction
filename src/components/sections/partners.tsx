import { listProviderMeta } from "@/lib/providers/registry";

// Tira de proveedores/partners integrados. Hoy usa los proveedores del
// comparador; a futuro se puede alimentar con logos reales (imágenes).
export function Partners() {
  const providers = listProviderMeta();

  return (
    <section className="border-y border-ink-100 bg-white py-10">
      <div className="container-x">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
          Proveedores y marcas integradas
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
          <div className="flex items-center rounded-2xl border border-dashed border-ink-200 px-5 py-3 text-sm font-medium text-ink-400">
            + tu marca acá
          </div>
        </div>
      </div>
    </section>
  );
}
