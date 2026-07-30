import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { checkRate } from "@/lib/rate-limit";
import { sendEmail, contactLeadEmail, leadNotifyTo } from "@/lib/mailer";

export const runtime = "nodejs";

const schema = z.object({
  name: z.string().min(2, "Ingresá tu nombre.").max(120),
  email: z.string().email("Email inválido."),
  phone: z.string().max(40).optional().or(z.literal("")),
  subject: z.string().max(160).optional().or(z.literal("")),
  service: z.string().max(80).optional().or(z.literal("")),
  message: z.string().min(10, "Contanos un poco más (mín. 10 caracteres).").max(2000),
  company: z.string().max(0).optional(), // honeypot
});

export async function POST(req: Request) {
  // Anti-abuso: 5 envíos cada 10 minutos por IP.
  const rate = checkRate(req, "contact", 5, 10 * 60 * 1000);
  if (!rate.ok) {
    return NextResponse.json(
      { error: "Demasiados envíos. Esperá unos minutos e intentá de nuevo." },
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

  if (parsed.data.company) return NextResponse.json({ ok: true }); // honeypot

  const { name, email, phone, subject, service, message } = parsed.data;

  try {
    await db.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        service: service || null,
        message,
      },
    });
  } catch (error) {
    console.error("contact error", error);
    return NextResponse.json(
      { error: "No pudimos enviar tu mensaje. Probá de nuevo." },
      { status: 500 }
    );
  }

  // Notificación por email (best-effort: no bloquea la respuesta si falla).
  const to = leadNotifyTo();
  if (to) {
    const { subject: s, html } = contactLeadEmail({ name, email, phone, subject, service, message });
    await sendEmail({ to, subject: s, html, replyTo: email });
  }

  return NextResponse.json({ ok: true });
}
