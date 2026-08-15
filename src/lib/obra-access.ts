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
  user: { id: string; email: string },
  /** Si ya tenés el dueño de la obra, pasalo: evita una consulta extra. */
  knownOwnerId?: string
): Promise<ObraAccess | null> {
  let ownerId = knownOwnerId;
  if (ownerId === undefined) {
    const obra = await db.obra.findUnique({
      where: { id: obraId },
      select: { memberId: true },
    });
    if (!obra) return null;
    ownerId = obra.memberId;
  }

  if (ownerId === user.id) {
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

/**
 * Obras que el usuario creó + obras a las que fue invitado.
 * Se evitan los `include` anidados (Prisma los resuelve uno por uno): traemos
 * los rubros y gastos de todas las obras en una sola consulta y agrupamos acá.
 */
export async function listObrasFor(user: { id: string; email: string }) {
  const email = user.email.toLowerCase();

  const [own, memberships] = await Promise.all([
    db.obra.findMany({
      where: { memberId: user.id },
      orderBy: { createdAt: "desc" },
    }),
    db.obraMember.findMany({ where: { email }, select: { obraId: true, role: true } }),
  ]);

  const invitedIds = memberships.map((m) => m.obraId);
  const invited = invitedIds.length
    ? await db.obra.findMany({
        where: { id: { in: invitedIds } },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const all = [...own, ...invited];
  const ids = all.map((o) => o.id);
  const [rubros, expenses] = ids.length
    ? await Promise.all([
        db.obraRubro.findMany({
          where: { obraId: { in: ids } },
          select: { obraId: true, budgeted: true, progress: true },
        }),
        db.obraExpense.findMany({
          where: { obraId: { in: ids } },
          select: { obraId: true, amount: true },
        }),
      ])
    : [[], []];

  const roleByObra = new Map(memberships.map((m) => [m.obraId, m.role]));
  const group = <T extends { obraId: string }>(rows: T[]) => {
    const map = new Map<string, T[]>();
    for (const r of rows) {
      const list = map.get(r.obraId) ?? [];
      list.push(r);
      map.set(r.obraId, list);
    }
    return map;
  };
  const rubrosBy = group(rubros);
  const expensesBy = group(expenses);

  return all.map((o) => {
    const isOwn = o.memberId === user.id;
    return {
      ...o,
      rubros: rubrosBy.get(o.id) ?? [],
      expenses: expensesBy.get(o.id) ?? [],
      shared: !isOwn,
      myRole: isOwn
        ? ("admin" as const)
        : roleByObra.get(o.id) === "editor"
          ? ("editor" as const)
          : ("viewer" as const),
    };
  });
}
