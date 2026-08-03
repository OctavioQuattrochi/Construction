import { TrendingUp, TrendingDown, Minus, LineChart } from "lucide-react";
import { getPriceIndex } from "@/lib/price-index";
import { materialLabel } from "@/lib/budget";
import { formatCurrency } from "@/lib/utils";

// Índice de precios de referencia del mercado (alimentado por el cron cada 6h).
// Se muestra sólo cuando ya hay datos guardados.
export async function PriceIndexSection() {
  const index = await getPriceIndex();
  if (index.length === 0) return null;

  const updated = new Date(
    Math.max(...index.map((r) => new Date(r.capturedAt).getTime()))
  ).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" });

  return (
    <section className="border-t border-ink-100 bg-concrete-50 py-14">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
              <LineChart className="h-4 w-4" /> Índice de precios
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-ink-900">
              Precios de referencia del mercado
            </h2>
          </div>
          <p className="text-xs text-ink-400">
            Precio más barato en vivo por material · actualizado {updated} · se
            refresca cada 6 h
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {index.map((row) => {
            const up = row.changePct != null && row.changePct > 0.5;
            const down = row.changePct != null && row.changePct < -0.5;
            return (
              <div
                key={row.material}
                className="flex items-center justify-between gap-3 rounded-2xl border border-ink-100 bg-white p-4 shadow-soft"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink-900">
                    {materialLabel(row.material)}
                  </p>
                  <p className="text-xs text-ink-400">
                    {row.unit} · {row.storeName}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-display text-lg font-bold text-ink-900">
                    {formatCurrency(row.price)}
                  </p>
                  {row.changePct != null && (
                    <p
                      className={`flex items-center justify-end gap-0.5 text-xs font-medium ${
                        up ? "text-red-600" : down ? "text-emerald-600" : "text-ink-400"
                      }`}
                    >
                      {up ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : down ? (
                        <TrendingDown className="h-3 w-3" />
                      ) : (
                        <Minus className="h-3 w-3" />
                      )}
                      {row.changePct > 0 ? "+" : ""}
                      {row.changePct.toFixed(1)}%
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
