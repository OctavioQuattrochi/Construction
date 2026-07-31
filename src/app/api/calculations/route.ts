import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getMemberSession } from "@/lib/member-auth";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().min(3, "Nombre mín. 3 caracteres").max(100),
  calcType: z.enum([
    "h17",
    "h21",
    "h30",
    "ladrillo",
    "bloque",
    "mortar",
    "paint",
    "flooring",
    "membrana",
    "durlock",
    "zocalo",
  ]),
  quantity: z.number().positive("Cantidad debe ser > 0"),
  result: z.record(z.string(), z.number()), // { cemento: 10, arena: 20 }
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

  const { name, calcType, quantity, result } = parsed.data;

  try {
    const calc = await db.savedCalculation.create({
      data: {
        memberId: session.id,
        name,
        calcType,
        quantity,
        result: JSON.stringify(result),
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
