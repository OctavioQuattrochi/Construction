import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  googleAuthUrl,
  googleRedirectUri,
  isGoogleConfigured,
  requestOrigin,
} from "@/lib/member-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const origin = requestOrigin(req);

  if (!isGoogleConfigured()) {
    return NextResponse.redirect(new URL("/ingresar?error=google_no_configurado", origin));
  }

  const state = crypto.randomUUID();
  const store = await cookies();
  store.set("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600,
  });

  return NextResponse.redirect(googleAuthUrl(state, googleRedirectUri(origin)));
}
