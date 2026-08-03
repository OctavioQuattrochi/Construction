"use client";

import { useCallback, useEffect, useState } from "react";

export interface BasketItem {
  id: string; // storeId + título
  title: string;
  store: string;
  storeId: string;
  unitPrice: number;
  url: string;
  qty: number;
}

const KEY = "bildap:lista";

// Lista de compra del comparador, persistida en el navegador.
export function useBasket() {
  const [items, setItems] = useState<BasketItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, ready]);

  const add = useCallback(
    (item: Omit<BasketItem, "qty" | "id"> & { id?: string }) => {
      const id = `${item.storeId}:${item.title}`;
      setItems((prev) => {
        const idx = prev.findIndex((p) => p.id === id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
          return next;
        }
        return [...prev, { ...item, id, qty: 1 }];
      });
    },
    []
  );

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((p) => p.id !== id)
        : prev.map((p) => (p.id === id ? { ...p, qty } : p))
    );
  }, []);

  const remove = useCallback(
    (id: string) => setItems((prev) => prev.filter((p) => p.id !== id)),
    []
  );

  const clear = useCallback(() => setItems([]), []);

  const total = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  // Total por tienda (comprando cada ítem donde está más barato).
  const byStore = Array.from(
    items.reduce((m, i) => {
      const cur = m.get(i.storeId) ?? { store: i.store, total: 0, count: 0 };
      cur.total += i.unitPrice * i.qty;
      cur.count += i.qty;
      m.set(i.storeId, cur);
      return m;
    }, new Map<string, { store: string; total: number; count: number }>())
  )
    .map(([, v]) => v)
    .sort((a, b) => b.total - a.total);

  return { items, add, setQty, remove, clear, total, count, byStore, ready };
}
