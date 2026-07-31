import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getMemberSession } from "@/lib/member-auth";

export const runtime = "nodejs";

const schema = z.object({
  type: z.enum(["property", "professional", "material", "article"]),
  refId: z.string().min(1).max(200),
  title: z.string().min(1).max(300),
  subtitle: z.string().max(300).optional(),
  href: z.string().max(500).optional(),
  image: z.string().max(600).optional(),
});

// Toggle: si ya existe lo quita, si no lo agrega. Devuelve { saved }.
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

  const { type, refId, title, subtitle, href, image } = parsed.data;
  const key = {
    memberId_type_refId: { memberId: session.id, type, refId },
  };

  try {
    const existing = await db.savedItem.findUnique({ where: key });
    if (existing) {
      await db.savedItem.delete({ where: { id: existing.id } });
      return NextResponse.json({ saved: false });
    }
    await db.savedItem.create({
      data: {
        memberId: session.id,
        type,
        refId,
        title,
        subtitle: subtitle || null,
        href: href || null,
        image: image || null,
      },
    });
    return NextResponse.json({ saved: true });
  } catch (error) {
    console.error("favorites error", error);
    return NextResponse.json({ error: "No se pudo guardar." }, { status: 500 });
  }
}
