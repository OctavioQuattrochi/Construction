import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import {
  createMemberSession,
  exchangeGoogleCode,
  googleRedirectUri,
  requestOrigin,
} from "@/lib/member-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const base = requestOrigin(req);
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const store = await cookies();
  const savedState = store.get("google_oauth_state")?.value;
  store.delete("google_oauth_state");

  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(new URL("/ingresar?error=estado_invalido", base));
  }

  const profile = await exchangeGoogleCode(code, googleRedirectUri(base));
  if (!profile) {
    return NextResponse.redirect(new URL("/ingresar?error=google_error", base));
  }

  try {
    const member = await db.member.upsert({
      where: { email: profile.email.toLowerCase() },
      update: { name: profile.name, image: profile.picture ?? null },
      create: {
        email: profile.email.toLowerCase(),
        name: profile.name,
        image: profile.picture ?? null,
        provider: "google",
      },
    });
    await createMemberSession({
      id: member.id,
      email: member.email,
      name: member.name,
      image: member.image ?? undefined,
    });
    return NextResponse.redirect(new URL("/?bienvenido=1", base));
  } catch {
    return NextResponse.redirect(new URL("/ingresar?error=db_error", base));
  }
}
