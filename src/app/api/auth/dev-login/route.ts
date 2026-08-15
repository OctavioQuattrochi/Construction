import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createMemberSession, requestOrigin } from "@/lib/member-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Acceso de prueba SOLO para desarrollo local.
 * Doble candado: requiere ALLOW_DEV_LOGIN=true (que nunca va a Netlify) Y que el
 * host sea localhost. En producción devuelve 404 siempre.
 */
function devLoginAllowed(req: Request): boolean {
  if (process.env.ALLOW_DEV_LOGIN !== "true") return false;
  const host = req.headers.get("host") ?? "";
  return host.startsWith("localhost") || host.startsWith("127.0.0.1");
}

export async function GET(req: Request) {
  if (!devLoginAllowed(req)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const email = "prueba@bildap.local";
  const member = await db.member.upsert({
    where: { email },
    update: {},
    create: { email, name: "Usuario de Prueba", provider: "dev" },
  });

  await createMemberSession({
    id: member.id,
    email: member.email,
    name: member.name,
    image: member.image ?? undefined,
  });

  return NextResponse.redirect(new URL("/mi-obra", requestOrigin(req)));
}
