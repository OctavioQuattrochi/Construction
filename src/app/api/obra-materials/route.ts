import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getMemberSession } from "@/lib/member-auth";
import { getObraAccess, listObrasFor } from "@/lib/obra-access";

export const runtime = "nodejs";

const schema = z.object({
  obraId: z.string().min(1),
  source: z.enum(["calculadora", "comparador", "manual"]).default("manual"),
  items: z
    .array(
      z.object({
        label: z.string().min(1).max(160),
        qty: z.number().nonnegative(),
        unit: z.string().max(40).optional(),
        unitPrice: z.number().nonnegative().optional(),
        store: z.string().max(80).optional(),
        url: z.string().max(500).optional(),
      })
    )
    .min(1)
    .max(40),
});

/** Agrega materiales a una obra del usuario (desde calculadoras o comparador). */
export async function POST(req: Request) {
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

  const { obraId, items, source } = parsed.data;
  // Autorización centralizada: el dueño y el editor invitado cargan materiales;
  // el viewer y cualquier otro, no. Antes esto comparaba memberId a mano y
  // dejaba afuera a los editores invitados, que sí pueden hacerlo desde la UI.
  const access = await getObraAccess(obraId, session);
  if (!access) {
    return NextResponse.json({ error: "Obra no encontrada." }, { status: 404 });
  }
  if (!access.canEdit) {
    return NextResponse.json(
      { error: "No tenés permiso para cargar materiales en esta obra." },
      { status: 403 }
    );
  }

  await db.obraMaterial.createMany({
    data: items.map((i) => ({
      obraId,
      label: i.label,
      qty: i.qty,
      unit: i.unit ?? null,
      unitPrice: i.unitPrice ?? null,
      store: i.store ?? null,
      url: i.url ?? null,
      source,
    })),
  });

  return NextResponse.json({ ok: true, added: items.length });
}

/** Lista las obras del usuario (para elegir a cuál agregar). */
export async function GET() {
  const session = await getMemberSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }
  // Mismas obras donde realmente puede cargar: propias + invitado como editor,
  // y sólo las activas (no tiene sentido cargar en una obra archivada).
  const all = await listObrasFor(session);
  const obras = all
    .filter((o) => o.myRole === "admin" || o.myRole === "editor")
    .map((o) => ({ id: o.id, name: o.name }));
  return NextResponse.json({ obras });
}
