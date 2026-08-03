"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, X, Store, Minus, Plus, Trash2, ExternalLink } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import type { useBasket } from "./use-basket";

type Basket = ReturnType<typeof useBasket>;

export function ComparatorBasket({ basket }: { basket: Basket }) {
  const [open, setOpen] = useState(false);
  if (!basket.ready || basket.count === 0) return null;

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-ink-900 px-5 py-3 text-sm font-semibold text-white shadow-elevated transition-transform hover:scale-105"
      >
        <ShoppingCart className="h-5 w-5 text-amber-400" />
        Mi lista
        <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-amber-500 px-1.5 text-xs font-bold text-ink-950">
          {basket.count}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/40"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-elevated"
            >
              <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
                <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink-900">
                  <ShoppingCart className="h-5 w-5 text-amber-500" /> Mi lista de compra
                </h2>
                <button onClick={() => setOpen(false)} className="text-ink-400 hover:text-ink-900">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 divide-y divide-ink-50 overflow-y-auto">
                {basket.items.map((i) => (
                  <div key={i.id} className="flex gap-3 px-5 py-3">
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium text-ink-900">{i.title}</p>
                      <p className="mt-0.5 text-xs text-ink-400">
                        {formatCurrency(i.unitPrice)} c/u · {i.store}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex items-center rounded-full border border-ink-200">
                          <button
                            onClick={() => basket.setQty(i.id, i.qty - 1)}
                            className="flex h-7 w-7 items-center justify-center text-ink-500 hover:text-ink-900"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-medium">{i.qty}</span>
                          <button
                            onClick={() => basket.setQty(i.id, i.qty + 1)}
                            className="flex h-7 w-7 items-center justify-center text-ink-500 hover:text-ink-900"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <a
                          href={i.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ink-400 hover:text-amber-600"
                          aria-label="Ver en la tienda"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => basket.remove(i.id)}
                          className="text-ink-400 hover:text-red-600"
                          aria-label="Quitar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <span className="shrink-0 font-mono text-sm font-semibold text-ink-900">
                      {formatCurrency(i.unitPrice * i.qty)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Resumen */}
              <div className="border-t border-ink-100 bg-concrete-50 px-5 py-4">
                <div className="mb-3">
                  <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-ink-700">
                    <Store className="h-3.5 w-3.5 text-amber-500" /> Comprando cada ítem donde sale más barato
                  </p>
                  {basket.byStore.map((s) => (
                    <div key={s.store} className="flex items-center justify-between text-sm">
                      <span className="text-ink-600">
                        {s.store} <span className="text-ink-400">({s.count})</span>
                      </span>
                      <span className="font-mono text-ink-900">{formatCurrency(s.total)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-ink-200 pt-3">
                  <span className="font-display font-bold text-ink-900">Total</span>
                  <span className="font-display text-xl font-bold text-amber-600">
                    {formatCurrency(basket.total)}
                  </span>
                </div>
                <button
                  onClick={basket.clear}
                  className={cn(
                    "mt-3 w-full rounded-full border border-ink-200 py-2 text-sm font-medium text-ink-600",
                    "hover:border-red-300 hover:text-red-600"
                  )}
                >
                  Vaciar lista
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
