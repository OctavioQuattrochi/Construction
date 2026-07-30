import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email("Ingresá un email válido."),
  source: z.string().optional(),
  // honeypot
  website: z.string().max(0).optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Datos inválidos." },
      { status: 400 }
    );
  }
  if (parsed.data.website) return NextResponse.json({ ok: true }); // honeypot

  const email = parsed.data.email.toLowerCase().trim();
  try {
    await db.subscriber.upsert({
      where: { email },
      update: { active: true },
      create: { email, source: parsed.data.source || "web" },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("newsletter error", error);
    return NextResponse.json(
      { error: "No pudimos suscribirte. Probá de nuevo." },
      { status: 500 }
    );
  }
}
