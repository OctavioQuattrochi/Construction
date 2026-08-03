import { NextResponse } from "next/server";
import { z } from "zod";
import { getMemberSession } from "@/lib/member-auth";
import { getMaterialPrices } from "@/lib/price-index";
import { materialLabel } from "@/lib/budget";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const schema = z.object({
  items: z
    .array(z.object({ key: z.string().max(40), qty: z.number().nonnegative() }))
    .min(1)
    .max(40),
});

export async function POST(req: Request) {
  // Sólo para usuarios registrados (es un beneficio de la cuenta).
  const session = await getMemberSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const items = parsed.data.items.filter((i) => i.qty > 0);
  const prices = await getMaterialPrices(items.map((i) => i.key));

  const lines = items.map((i) => {
    const p = prices[i.key];
    const qty = Math.round(i.qty * 100) / 100;
    return {
      key: i.key,
      label: materialLabel(i.key),
      qty,
      unit: p?.unit ?? null,
      unitPrice: p ? p.price : null,
      subtotal: p ? Math.round(p.price * qty) : null,
      store: p?.storeName ?? null,
      storeId: p?.storeId ?? null,
      url: p?.url ?? null,
    };
  });

  const priced = lines.filter((l) => l.subtotal != null);
  const total = priced.reduce((s, l) => s + (l.subtotal ?? 0), 0);

  // Resumen por tienda: cuánto saldría comprar cada material en su tienda más barata.
  const storeMap = new Map<string, { store: string; total: number; count: number }>();
  for (const l of priced) {
    const cur = storeMap.get(l.storeId!) ?? { store: l.store!, total: 0, count: 0 };
    cur.total += l.subtotal!;
    cur.count += 1;
    storeMap.set(l.storeId!, cur);
  }
  const byStore = Array.from(storeMap.values()).sort((a, b) => b.total - a.total);

  return NextResponse.json({
    lines,
    total,
    pricedCount: priced.length,
    unpricedCount: lines.length - priced.length,
    byStore,
    capturedAt: new Date().toISOString(),
  });
}
