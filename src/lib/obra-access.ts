import { db } from "./db";

export type ObraRole = "admin" | "editor" | "viewer";

export interface ObraAccess {
  role: ObraRole;
  canEdit: boolean; // cargar avance, gastos, materiales, bitácora
  canManage: boolean; // invitar/quitar gente, borrar la obra
}

/**
 * Acceso de un usuario a una obra. Una sola fuente de verdad:
 * - admin  = quien la creó (controla todo, incluida la gente invitada)
 * - editor = invitado que carga datos (típicamente el profesional a cargo)
 * - viewer = invitado que sólo mira (típicamente el propietario/cliente)
 * Devuelve null si no tiene ningún acceso.
 */
export async function getObraAccess(
  obraId: string,
  user: { id: string; email: string }
): Promise<ObraAccess | null> {
  const obra = await db.obra.findUnique({
    where: { id: obraId },
    select: { memberId: true },
  });
  if (!obra) return null;

  if (obra.memberId === user.id) {
    return { role: "admin", canEdit: true, canManage: true };
  }

  const invite = await db.obraMember.findUnique({
    where: { obraId_email: { obraId, email: user.email.toLowerCase() } },
    select: { role: true },
  });
  if (!invite) return null;

  const role: ObraRole = invite.role === "editor" ? "editor" : "viewer";
  return { role, canEdit: role === "editor", canManage: false };
}

/** Obras que el usuario creó + obras a las que fue invitado. */
export async function listObrasFor(user: { id: string; email: string }) {
  const [own, invited] = await Promise.all([
    db.obra.findMany({
      where: { memberId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        rubros: { select: { budgeted: true, progress: true } },
        expenses: { select: { amount: true } },
      },
    }),
    db.obra.findMany({
      where: { participants: { some: { email: user.email.toLowerCase() } } },
      orderBy: { createdAt: "desc" },
      include: {
        rubros: { select: { budgeted: true, progress: true } },
        expenses: { select: { amount: true } },
        participants: {
          where: { email: user.email.toLowerCase() },
          select: { role: true },
        },
      },
    }),
  ]);

  return [
    ...own.map((o) => ({ ...o, shared: false, myRole: "admin" as const })),
    ...invited.map((o) => ({
      ...o,
      shared: true,
      myRole: (o.participants[0]?.role === "editor" ? "editor" : "viewer") as
        | "editor"
        | "viewer",
    })),
  ];
}
