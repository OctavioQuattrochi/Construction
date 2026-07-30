"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ExternalLink,
  TrendingDown,
  Loader2,
  PackageSearch,
  BadgeCheck,
  CircleSlash,
  HelpCircle,
  ArrowDownWideNarrow,
} from "lucide-react";
import { Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";
import type {
  CompareResult,
  NormalizedProduct,
  Availability,
} from "@/lib/providers/types";

const SUGGESTIONS = [
  "cemento",
  "cal",
  "hierro",
  "ladrillo hueco",
  "arena",
  "membrana",
  "pintura latex",
  "porcelanato",
  "durlock",
  "hidrófugo",
];

type Grouped = {
  sku: string;
  title: string;
  brand: string | null;
  image: string | null;
  category: string | null;
  packageSize: string | null;
  offers: NormalizedProduct[];
  min: number | null;
  max: number | null;
  savings: number;
};

function groupClient(products: NormalizedProduct[]): Grouped[] {
  const map = new Map<string, NormalizedProduct[]>();
  for (const p of products) {
    const list = map.get(p.sku) ?? [];
    list.push(p);
    map.set(p.sku, list);
  }
  return Array.from(map.entries())
    .map(([sku, items]) => {
      const offers = [...items].sort((a, b) => {
        if (a.price == null) return 1;
        if (b.price == null) return -1;
        return a.price - b.price;
      });
      const prices = offers
        .map((o) => o.price)
        .filter((p): p is number => p != null);
      return {
        sku,
        title: offers[0].title,
        brand: offers[0].brand,
        image: offers[0].image,
        category: offers[0].category,
        packageSize: offers[0].packageSize,
        offers,
        min: prices.length ? Math.min(...prices) : null,
        max: prices.length ? Math.max(...prices) : null,
        savings: prices.length > 1 ? Math.max(...prices) - Math.min(...prices) : 0,
      };
    })
    .sort((a, b) => (a.min ?? Infinity) - (b.min ?? Infinity));
}

const availabilityMeta: Record<
  Availability,
  { label: string; className: string; Icon: typeof BadgeCheck }
> = {
  in_stock: {
    label: "Disponible",
    className: "text-emerald-600 bg-emerald-50 border-emerald-200",
    Icon: BadgeCheck,
  },
  out_of_stock: {
    label: "Sin stock",
    className: "text-red-600 bg-red-50 border-red-200",
    Icon: CircleSlash,
  },
  unknown: {
    label: "Consultar",
    className: "text-ink-500 bg-ink-50 border-ink-200",
    Icon: HelpCircle,
  },
};

export function ComparatorClient() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState<CompareResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState("");
  // Evita condiciones de carrera: solo la última búsqueda actualiza la UI.
  const requestRef = useRef(0);

  const runSearch = useCallback(async (q: string) => {
    const term = q.trim();
    if (term.length < 2) return;
    const reqId = ++requestRef.current;
    setLoading(true);
    setError(null);
    setSearched(term);
    setData(null); // limpia resultados anteriores de inmediato
    try {
      const res = await fetch(
        `/api/compare?q=${encodeURIComponent(term)}&t=${Date.now()}`,
        { cache: "no-store" }
      );
      const json = await res.json();
      // Descartar si llegó una respuesta de una búsqueda más nueva.
      if (reqId !== requestRef.current) return;
      if (!res.ok) throw new Error(json.error || "Error de búsqueda");
      setData(json as CompareResult);
    } catch (e) {
      if (reqId !== requestRef.current) return;
      setError(e instanceof Error ? e.message : "Error inesperado");
      setData(null);
    } finally {
      if (reqId === requestRef.current) setLoading(false);
    }
  }, []);

  const groups = useMemo(
    () => (data ? groupClient(data.products) : []),
    [data]
  );

  const liveIds = useMemo(
    () =>
      new Set(
        (data?.results ?? []).filter((r) => r.live).map((r) => r.provider.id)
      ),
    [data]
  );
  const liveCount = liveIds.size;

  const retrievedLabel = data
    ? new Date(data.retrievedAt).toLocaleString("es-AR", {
        dateStyle: "short",
        timeStyle: "short",
      })
    : "";

  return (
    <div>
      {/* Search */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          runSearch(query);
        }}
        className="relative"
      >
        <div className="flex flex-col gap-3 rounded-3xl border border-ink-100 bg-white p-3 shadow-elevated sm:flex-row sm:items-center sm:rounded-full sm:pl-6">
          <div className="flex flex-1 items-center gap-3">
            <Search className="h-5 w-5 shrink-0 text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscá un material: cemento, hierro, pintura…"
              className="w-full bg-transparent py-2.5 text-ink-900 placeholder:text-ink-300 focus:outline-none"
              autoFocus
            />
          </div>
          <Button
            type="submit"
            size="md"
            disabled={loading || query.trim().length < 2}
            className="sm:rounded-full"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Comparar
          </Button>
        </div>
      </form>

      {/* Suggestions */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="text-sm text-ink-400">Populares:</span>
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => {
              setQuery(s);
              runSearch(s);
            }}
            className="rounded-full border border-ink-200 px-3 py-1 text-sm text-ink-600 transition-colors hover:border-amber-500 hover:bg-amber-500/10 hover:text-amber-700"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Meta bar */}
      {data && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink-100 bg-concrete-50 px-5 py-3 text-sm"
        >
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-ink-600">
            <span className="font-medium text-ink-900">
              {groups.length} producto(s) · {data.totalProducts} ofertas
            </span>
            <span className="flex items-center gap-1.5">
              <ArrowDownWideNarrow className="h-4 w-4 text-amber-500" />
              Ordenado por precio
            </span>
            <span className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {liveCount}/{data.providersQueried} en vivo
            </span>
          </div>
          <span className="text-ink-400">Datos obtenidos: {retrievedLabel}</span>
        </motion.div>
      )}

      {/* States */}
      {loading && <ResultsSkeleton />}

      {error && !loading && (
        <div className="mt-10 rounded-3xl border border-red-100 bg-red-50 p-8 text-center text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && data && groups.length === 0 && (
        <EmptyState query={searched} />
      )}

      {!loading && !error && !data && <IntroState />}

      {/* Results */}
      <div className="mt-8 space-y-5">
        <AnimatePresence>
          {!loading &&
            groups.map((g, i) => (
              <ProductGroup key={g.sku} group={g} index={i} liveIds={liveIds} />
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ProductGroup({
  group,
  index,
  liveIds,
}: {
  group: Grouped;
  index: number;
  liveIds: Set<string>;
}) {
  const cheapestId = group.offers.find((o) => o.price != null)?.id;
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
      className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft"
    >
      <div className="flex flex-col gap-4 border-b border-ink-100 bg-concrete-50/60 p-5 sm:flex-row sm:items-center">
        {group.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={group.image}
            alt={group.title}
            className="h-16 w-16 shrink-0 rounded-2xl object-cover"
            loading="lazy"
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {group.brand && <Badge>{group.brand}</Badge>}
            {group.category && (
              <span className="text-xs text-ink-400">{group.category}</span>
            )}
          </div>
          <h3 className="mt-1 font-display text-lg font-semibold text-ink-900">
            {group.title}
          </h3>
          {group.packageSize && (
            <p className="text-sm text-ink-400">Presentación: {group.packageSize}</p>
          )}
        </div>
        <div className="text-right">
          {group.min != null && (
            <>
              <p className="text-xs uppercase tracking-wide text-ink-400">Desde</p>
              <p className="font-display text-2xl font-bold text-ink-900">
                {formatCurrency(group.min)}
              </p>
              {group.savings > 0 && (
                <p className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                  <TrendingDown className="h-3.5 w-3.5" />
                  Ahorrás hasta {formatCurrency(group.savings)}
                </p>
              )}
            </>
          )}
        </div>
      </div>

      <div className="divide-y divide-ink-50">
        {group.offers.map((offer) => (
          <OfferRow
            key={offer.id}
            offer={offer}
            best={offer.id === cheapestId}
            live={liveIds.has(offer.provider.id)}
          />
        ))}
      </div>
    </motion.article>
  );
}

function OfferRow({
  offer,
  best,
  live,
}: {
  offer: NormalizedProduct;
  best: boolean;
  live: boolean;
}) {
  const av = availabilityMeta[offer.availability];
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3 px-5 py-4 transition-colors sm:flex-nowrap",
        best ? "bg-amber-500/[0.06]" : "hover:bg-ink-50/60"
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
          style={{ backgroundColor: offer.provider.logoColor }}
          title={offer.provider.name}
        >
          {offer.provider.name.slice(0, 2).toUpperCase()}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-medium text-ink-800">
              {offer.provider.name}
            </p>
            {live ? (
              <span
                className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-emerald-600"
                title="Precio obtenido en tiempo real del sitio del proveedor"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                En vivo
              </span>
            ) : (
              <span
                className="rounded-full bg-ink-100 px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-ink-400"
                title="Precio estimado de referencia (este proveedor aún no tiene integración en vivo)"
              >
                Referencia
              </span>
            )}
          </div>
          <p className="text-xs text-ink-400">{offer.provider.region}</p>
        </div>
      </div>

      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
          av.className
        )}
      >
        <av.Icon className="h-3 w-3" />
        {av.label}
      </span>

      <div className="ml-auto flex items-center gap-4">
        <div className="text-right">
          {best && (
            <span className="mb-0.5 block text-[0.65rem] font-bold uppercase tracking-wide text-amber-600">
              Mejor precio
            </span>
          )}
          <span
            className={cn(
              "font-mono text-base font-semibold",
              best ? "text-ink-900" : "text-ink-700"
            )}
          >
            {offer.price != null ? formatCurrency(offer.price) : "s/d"}
          </span>
        </div>
        <a
          href={offer.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-all btn-focus",
            best
              ? "bg-ink-900 text-white hover:bg-ink-800"
              : "border border-ink-200 text-ink-700 hover:border-ink-900"
          )}
        >
          Ver
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

function ResultsSkeleton() {
  return (
    <div className="mt-8 space-y-5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="overflow-hidden rounded-3xl border border-ink-100 bg-white"
        >
          <div className="flex items-center gap-4 border-b border-ink-100 bg-concrete-50/60 p-5">
            <div className="h-16 w-16 shrink-0 rounded-2xl bg-ink-100" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 rounded bg-ink-100" />
              <div className="h-4 w-2/3 rounded bg-ink-100" />
            </div>
            <div className="h-8 w-24 rounded bg-ink-100" />
          </div>
          {[0, 1, 2].map((j) => (
            <div key={j} className="flex items-center gap-3 px-5 py-4">
              <div className="h-9 w-9 rounded-lg bg-ink-100" />
              <div className="h-3 w-28 rounded bg-ink-100" />
              <div className="ml-auto h-8 w-32 rounded-full bg-ink-100" />
            </div>
          ))}
          <div className="pointer-events-none relative h-0 overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="mt-12 flex flex-col items-center rounded-3xl border border-dashed border-ink-200 bg-white p-12 text-center">
      <PackageSearch className="h-12 w-12 text-ink-300" />
      <h3 className="mt-4 font-display text-lg font-semibold text-ink-900">
        Sin resultados para “{query}”
      </h3>
      <p className="mt-1 max-w-sm text-sm text-ink-500">
        Probá con un término más general, como “cemento” o “pintura”. Estamos
        sumando proveedores y productos constantemente.
      </p>
    </div>
  );
}

function IntroState() {
  return (
    <div className="mt-12 grid gap-4 sm:grid-cols-3">
      {[
        {
          n: "01",
          t: "Buscás un material",
          d: "Escribí el material que necesitás comprar.",
        },
        {
          n: "02",
          t: "Consultamos proveedores",
          d: "El sistema busca en varios corralones y retails.",
        },
        {
          n: "03",
          t: "Comparás y comprás",
          d: "Ves precio, stock y link de compra en un solo lugar.",
        },
      ].map((s) => (
        <div key={s.n} className="rounded-3xl border border-ink-100 bg-white p-6">
          <span className="font-mono text-sm font-bold text-amber-500">
            {s.n}
          </span>
          <h3 className="mt-2 font-display font-semibold text-ink-900">{s.t}</h3>
          <p className="mt-1 text-sm text-ink-500">{s.d}</p>
        </div>
      ))}
    </div>
  );
}
