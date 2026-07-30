import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { googleAuthUrl, isGoogleConfigured } from "@/lib/member-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!isGoogleConfigured()) {
    return NextResponse.redirect(
      new URL(
        "/ingresar?error=google_no_configurado",
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      )
    );
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

  return NextResponse.redirect(googleAuthUrl(state));
}
