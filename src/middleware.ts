import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ADMIN_AUDIENCE = "bildap-admin";

function getSecret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (s && s.length >= 32) return new TextEncoder().encode(s);
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET no configurado (requerido en producción).");
  }
  return new TextEncoder().encode("insecure-dev-secret-change-me-please-32chars");
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard /admin (but never the login page itself)
  if (!pathname.startsWith("/admin") || pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("construction_session")?.value;
  if (token) {
    try {
      // Audiencia admin + rol admin: un token de miembro (misma firma, otra
      // audiencia) no pasa. La autorización real vive en getSession()/layout;
      // esto es la primera barrera en el borde.
      const { payload } = await jwtVerify(token, getSecret(), {
        audience: ADMIN_AUDIENCE,
      });
      if (payload.role === "admin") return NextResponse.next();
    } catch {
      /* invalid — fall through to redirect */
    }
  }

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"],
};
