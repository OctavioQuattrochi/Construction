import { NextResponse } from "next/server";
import { z } from "zod";
import { authenticate, createSession } from "@/lib/auth";
import { checkRate } from "@/lib/rate-limit";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  // Anti fuerza-bruta del panel: 8 intentos por minuto por IP.
  const rate = checkRate(req, "admin-login", 8, 60 * 1000);
  if (!rate.ok) {
    return NextResponse.json(
      { error: "Demasiados intentos. Esperá un momento." },
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
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const user = await authenticate(parsed.data.email, parsed.data.password);
  if (!user) {
    return NextResponse.json(
      { error: "Email o contraseña incorrectos." },
      { status: 401 }
    );
  }

  await createSession(user);
  return NextResponse.json({ ok: true, user: { name: user.name } });
}
