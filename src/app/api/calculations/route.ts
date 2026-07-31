import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getMemberSession } from "@/lib/member-auth";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().min(3, "Nombre mín. 3 caracteres").max(100),
  calcType: z.string().min(1).max(40), // id de la calculadora
  calcName: z.string().max(60).optional(), // nombre legible ("Hormigón")
  quantity: z.number().positive("Cantidad debe ser > 0"),
  rows: z
    .array(z.object({ label: z.string().max(120), value: z.string().max(120) }))
    .min(1)
    .max(20),
  budget: z
    .array(z.object({ key: z.string().max(40), qty: z.number() }))
    .max(30)
    .optional(),
});

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

  const { name, calcType, calcName, quantity, rows, budget } = parsed.data;

  try {
    const calc = await db.savedCalculation.create({
      data: {
        memberId: session.id,
        name,
        calcType: calcName || calcType,
        quantity,
        result: JSON.stringify({ rows, budget: budget ?? [] }),
      },
    });
    return NextResponse.json({ id: calc.id });
  } catch (error) {
    console.error("calculations error", error);
    return NextResponse.json({ error: "No se pudo guardar." }, { status: 500 });
  }
}

// DELETE para eliminar un cálculo guardado.
export async function DELETE(req: Request) {
  const session = await getMemberSession();
  if (!session) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID requerido." }, { status: 400 });
  }

  try {
    const calc = await db.savedCalculation.findUnique({ where: { id } });
    if (!calc || calc.memberId !== session.id) {
      return NextResponse.json({ error: "No encontrado." }, { status: 404 });
    }
    await db.savedCalculation.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("calculations delete error", error);
    return NextResponse.json({ error: "No se pudo eliminar." }, { status: 500 });
  }
}
