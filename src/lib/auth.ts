import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "./db";

const COOKIE_NAME = "construction_session";

// Audiencia del token de administrador. Un token de miembro (audiencia distinta)
// NO puede pasar por acá aunque esté firmado con el mismo secreto: cierra la
// confusión de tokens entre el panel y las cuentas públicas.
const ADMIN_AUDIENCE = "bildap-admin";

/**
 * Secreto de firma. Falla cerrado en producción: si AUTH_SECRET no está
 * configurado no se usa un valor conocido (eso permitiría forjar sesiones),
 * se corta. En desarrollo se permite un fallback para no frenar el trabajo.
 */
function getSecret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (s && s.length >= 32) return new TextEncoder().encode(s);
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET no configurado (requerido en producción).");
  }
  return new TextEncoder().encode("insecure-dev-secret-change-me-please-32chars");
}

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setAudience(ADMIN_AUDIENCE)
    .setExpirationTime("7d")
    .sign(getSecret());

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      audience: ADMIN_AUDIENCE,
    });
    // Exigir rol de administrador explícitamente: no alcanza con que el token
    // sea válido, tiene que ser un admin. Un token sin rol admin se rechaza.
    if (payload.role !== "admin") return null;
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}

export async function authenticate(
  email: string,
  password: string
): Promise<SessionUser | null> {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) return null;
  const ok = await verifyPassword(password, user.password);
  if (!ok) return null;
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) throw new Error("UNAUTHORIZED");
  return session;
}
