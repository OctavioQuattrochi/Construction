import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { checkRate } from "@/lib/rate-limit";
import { sendEmail, newsletterEmail, leadNotifyTo } from "@/lib/mailer";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email("Ingresá un email válido."),
  source: z.string().optional(),
  website: z.string().max(0).optional(), // honeypot
});

export async function POST(req: Request) {
  const rate = checkRate(req, "newsletter", 5, 10 * 60 * 1000);
  if (!rate.ok) {
    return NextResponse.json(
      { error: "Demasiados intentos. Esperá unos minutos." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfter) } }
    );
  }

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

  let created = false;
  try {
    const existing = await db.subscriber.findUnique({ where: { email } });
    await db.subscriber.upsert({
      where: { email },
      update: { active: true },
      create: { email, source: parsed.data.source || "web" },
    });
    created = !existing;
  } catch (error) {
    console.error("newsletter error", error);
    return NextResponse.json(
      { error: "No pudimos suscribirte. Probá de nuevo." },
      { status: 500 }
    );
  }

  // Notificar sólo cuando es un suscriptor nuevo.
  const to = leadNotifyTo();
  if (created && to) {
    const { subject, html } = newsletterEmail(email);
    await sendEmail({ to, subject, html });
  }

  return NextResponse.json({ ok: true });
}
