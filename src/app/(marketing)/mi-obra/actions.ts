"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getMemberSession } from "@/lib/member-auth";
import { getObraAccess } from "@/lib/obra-access";
import { materialsVariationSince } from "@/lib/price-index";

async function requireMember() {
  const session = await getMemberSession();
  if (!session) redirect("/ingresar");
  return session;
}

/**
 * Verifica que el usuario pueda EDITAR la obra (creador o invitado como editor).
 * Los "viewer" no pueden ejecutar ninguna de estas acciones.
 */
async function ownObra(
  obraId: string,
  memberId: string,
  email?: string
) {
  const access = await getObraAccess(obraId, {
    id: memberId,
    email: email ?? "",
  });
  if (!access?.canEdit) redirect("/mi-obra");
  return access;
}

const str = (fd: FormData, k: string) => (fd.get(k)?.toString() ?? "").trim();
const num = (fd: FormData, k: string) => {
  const v = parseFloat(str(fd, k).replace(",", "."));
  return Number.isFinite(v) ? v : 0;
};
const date = (fd: FormData, k: string) => {
  const v = str(fd, k);
  return v ? new Date(v) : null;
};

// ------------------------------------------------------------------- OBRA
export async function createObra(fd: FormData) {
  const m = await requireMember();
  const name = str(fd, "name");
  if (!name) return;
  const obra = await db.obra.create({
    data: {
      memberId: m.id,
      name,
      location: str(fd, "location") || null,
      startDate: date(fd, "startDate"),
      estimatedEnd: date(fd, "estimatedEnd"),
      status: str(fd, "status") || "planificacion",
    },
  });
  // Rubros por defecto: las etapas típicas de una obra.
  const defaults = [
    "Movimiento de suelos",
    "Fundaciones",
    "Estructura",
    "Mampostería",
    "Techos",
    "Instalaciones",
    "Revoques",
    "Pisos y revestimientos",
    "Terminaciones",
  ];
  await db.obraRubro.createMany({
    data: defaults.map((name, i) => ({ obraId: obra.id, name, order: i })),
  });
  revalidatePath("/mi-obra");
  redirect(`/mi-obra/${obra.id}`);
}

export async function updateObra(fd: FormData) {
  const m = await requireMember();
  const id = str(fd, "id");
  await ownObra(id, m.id, m.email);
  await db.obra.update({
    where: { id },
    data: {
      name: str(fd, "name"),
      location: str(fd, "location") || null,
      startDate: date(fd, "startDate"),
      estimatedEnd: date(fd, "estimatedEnd"),
      status: str(fd, "status"),
    },
  });
  revalidatePath(`/mi-obra/${id}`);
}

export async function deleteObra(fd: FormData) {
  const m = await requireMember();
  const id = str(fd, "id");
  // Borrar la obra es sólo del creador, no de un editor invitado.
  await manageObra(id, m.id, m.email);
  await db.obra.delete({ where: { id } });
  revalidatePath("/mi-obra");
  redirect("/mi-obra");
}

// -------------------------------------------------------------- PRESUPUESTO
/** Congela el presupuesto actual como línea base (el "original" de la obra). */
export async function setBaseline(fd: FormData) {
  const m = await requireMember();
  const obraId = str(fd, "obraId");
  await ownObra(obraId, m.id, m.email);

  const rubros = await db.obraRubro.findMany({ where: { obraId } });
  const total = rubros.reduce((s, r) => s + r.budgeted, 0);
  if (total <= 0) return;

  await db.obra.update({
    where: { id: obraId },
    data: {
      baselineTotal: total,
      baselineAt: new Date(),
      baselineUsdRate: num(fd, "usdRate") || null,
    },
  });
  revalidatePath(`/mi-obra/${obraId}`);
}

/** Registra un ajuste: inflación, cambio pedido por el propietario o corrección. */
export async function addAdjustment(fd: FormData) {
  const m = await requireMember();
  const obraId = str(fd, "obraId");
  await ownObra(obraId, m.id, m.email);

  const type = str(fd, "type");
  const amount = num(fd, "amount");
  const reason = str(fd, "reason");
  if (!reason || amount === 0) return;

  await db.obraAdjustment.create({
    data: {
      obraId,
      type: ["inflacion", "cambio", "correccion"].includes(type) ? type : "cambio",
      amount,
      reason,
      days: Math.round(num(fd, "days")),
      // La inflación y las correcciones no requieren aprobación; los cambios sí.
      approved: type !== "cambio",
    },
  });
  revalidatePath(`/mi-obra/${obraId}`);
}

/** El propietario aprueba (o rechaza) un cambio propuesto. */
export async function approveAdjustment(fd: FormData) {
  const m = await requireMember();
  const obraId = str(fd, "obraId");
  // Aprobar es potestad de quien administra la obra (el propietario/creador).
  await manageObra(obraId, m.id, m.email);
  await db.obraAdjustment.update({
    where: { id: str(fd, "id") },
    data: { approved: true },
  });
  revalidatePath(`/mi-obra/${obraId}`);
}

export async function deleteAdjustment(fd: FormData) {
  const m = await requireMember();
  const obraId = str(fd, "obraId");
  await ownObra(obraId, m.id, m.email);
  await db.obraAdjustment.delete({ where: { id: str(fd, "id") } });
  revalidatePath(`/mi-obra/${obraId}`);
}

/**
 * Actualiza el presupuesto por inflación usando el índice de precios REAL de
 * BildAp: compara el precio de los materiales de hace X con el de hoy y propone
 * el ajuste. Es la ventaja de tener el histórico del comparador.
 */
export async function applyInflation(fd: FormData) {
  const m = await requireMember();
  const obraId = str(fd, "obraId");
  await ownObra(obraId, m.id, m.email);

  const obra = await db.obra.findUnique({ where: { id: obraId } });
  if (!obra?.baselineAt || !obra.baselineTotal) return;

  const variation = await materialsVariationSince(obra.baselineAt);
  if (variation == null || Math.abs(variation) < 0.5) return;

  // Ya ajustado por inflación antes: sólo sumamos la diferencia no cubierta.
  const previos = await db.obraAdjustment.aggregate({
    where: { obraId, type: "inflacion" },
    _sum: { amount: true },
  });
  const objetivo = (obra.baselineTotal * variation) / 100;
  const delta = Math.round(objetivo - (previos._sum.amount ?? 0));
  if (Math.abs(delta) < 1) return;

  await db.obraAdjustment.create({
    data: {
      obraId,
      type: "inflacion",
      amount: delta,
      reason: `Actualización por variación de precios de materiales (${variation > 0 ? "+" : ""}${variation.toFixed(1)}% desde ${obra.baselineAt.toLocaleDateString("es-AR")})`,
      approved: true,
    },
  });
  revalidatePath(`/mi-obra/${obraId}`);
}

// ----------------------------------------------------------- PARTICIPANTES
/** Sólo el creador puede administrar la gente invitada. */
async function manageObra(obraId: string, memberId: string, email: string) {
  const access = await getObraAccess(obraId, { id: memberId, email });
  if (!access?.canManage) redirect(`/mi-obra/${obraId}`);
  return access;
}

export async function inviteToObra(fd: FormData) {
  const m = await requireMember();
  const obraId = str(fd, "obraId");
  await manageObra(obraId, m.id, m.email);

  const email = str(fd, "email").toLowerCase();
  if (!email || !email.includes("@")) return;
  // No invitarse a uno mismo.
  if (email === m.email.toLowerCase()) return;

  const role = str(fd, "role") === "editor" ? "editor" : "viewer";
  await db.obraMember.upsert({
    where: { obraId_email: { obraId, email } },
    update: { role, name: str(fd, "name") || null },
    create: { obraId, email, role, name: str(fd, "name") || null },
  });
  revalidatePath(`/mi-obra/${obraId}`);
}

export async function removeFromObra(fd: FormData) {
  const m = await requireMember();
  const obraId = str(fd, "obraId");
  await manageObra(obraId, m.id, m.email);
  await db.obraMember.delete({ where: { id: str(fd, "id") } });
  revalidatePath(`/mi-obra/${obraId}`);
}

// ------------------------------------------------------------------ RUBROS
export async function saveRubro(fd: FormData) {
  const m = await requireMember();
  const obraId = str(fd, "obraId");
  await ownObra(obraId, m.id, m.email);
  const id = str(fd, "id");
  const data = {
    name: str(fd, "name"),
    budgeted: num(fd, "budgeted"),
    progress: Math.max(0, Math.min(100, Math.round(num(fd, "progress")))),
  };
  if (id) await db.obraRubro.update({ where: { id }, data });
  else await db.obraRubro.create({ data: { ...data, obraId } });
  revalidatePath(`/mi-obra/${obraId}`);
}

/**
 * Distribución típica del costo de una obra por etapa (referencia del rubro en
 * Argentina). Sirve como ancla: el usuario carga UN número (el total) y no tiene
 * que adivinar cuánto vale cada etapa. Después puede ajustar a mano.
 */
const BUDGET_SHARES: Record<string, number> = {
  "Movimiento de suelos": 3,
  Fundaciones: 9,
  Estructura: 18,
  Mampostería: 12,
  Techos: 10,
  Instalaciones: 15,
  Revoques: 8,
  "Pisos y revestimientos": 13,
  Terminaciones: 12,
};

/** Reparte un presupuesto total entre las etapas usando los % de referencia. */
export async function distributeBudget(fd: FormData) {
  const m = await requireMember();
  const obraId = str(fd, "obraId");
  await ownObra(obraId, m.id, m.email);
  const total = num(fd, "total");
  if (total <= 0) return;

  const rubros = await db.obraRubro.findMany({ where: { obraId } });
  if (rubros.length === 0) return;

  // Las etapas estándar usan su porcentaje típico. Las que agregó el usuario
  // (ej. "Pileta") reciben el promedio de las conocidas, para que nunca queden
  // en cero. Después se normaliza todo para que sume exactamente el total.
  const knownValues = Object.values(BUDGET_SHARES);
  const avgShare =
    knownValues.reduce((s, v) => s + v, 0) / knownValues.length;
  const shares = rubros.map((r) => BUDGET_SHARES[r.name] ?? avgShare);
  const sum = shares.reduce((s, v) => s + v, 0);

  await Promise.all(
    rubros.map((r, i) =>
      db.obraRubro.update({
        where: { id: r.id },
        data: { budgeted: Math.round((total * shares[i]) / sum) },
      })
    )
  );
  revalidatePath(`/mi-obra/${obraId}`);
}

export async function deleteRubro(fd: FormData) {
  const m = await requireMember();
  const obraId = str(fd, "obraId");
  await ownObra(obraId, m.id, m.email);
  await db.obraRubro.delete({ where: { id: str(fd, "id") } });
  revalidatePath(`/mi-obra/${obraId}`);
}

// --------------------------------------------------------------- MATERIALES
export async function saveMaterial(fd: FormData) {
  const m = await requireMember();
  const obraId = str(fd, "obraId");
  await ownObra(obraId, m.id, m.email);
  await db.obraMaterial.create({
    data: {
      obraId,
      label: str(fd, "label"),
      qty: num(fd, "qty"),
      unit: str(fd, "unit") || null,
      unitPrice: num(fd, "unitPrice") || null,
      store: str(fd, "store") || null,
      source: str(fd, "source") || "manual",
    },
  });
  revalidatePath(`/mi-obra/${obraId}`);
}

export async function setMaterialStatus(fd: FormData) {
  const m = await requireMember();
  const obraId = str(fd, "obraId");
  await ownObra(obraId, m.id, m.email);
  await db.obraMaterial.update({
    where: { id: str(fd, "id") },
    data: { status: str(fd, "status") },
  });
  revalidatePath(`/mi-obra/${obraId}`);
}

export async function deleteMaterial(fd: FormData) {
  const m = await requireMember();
  const obraId = str(fd, "obraId");
  await ownObra(obraId, m.id, m.email);
  await db.obraMaterial.delete({ where: { id: str(fd, "id") } });
  revalidatePath(`/mi-obra/${obraId}`);
}

// ------------------------------------------------------------------ GASTOS
export async function saveExpense(fd: FormData) {
  const m = await requireMember();
  const obraId = str(fd, "obraId");
  await ownObra(obraId, m.id, m.email);
  await db.obraExpense.create({
    data: {
      obraId,
      rubroId: str(fd, "rubroId") || null,
      description: str(fd, "description"),
      amount: num(fd, "amount"),
      date: date(fd, "date") ?? new Date(),
    },
  });
  revalidatePath(`/mi-obra/${obraId}`);
}

export async function deleteExpense(fd: FormData) {
  const m = await requireMember();
  const obraId = str(fd, "obraId");
  await ownObra(obraId, m.id, m.email);
  await db.obraExpense.delete({ where: { id: str(fd, "id") } });
  revalidatePath(`/mi-obra/${obraId}`);
}

// ------------------------------------------------------------ LIBRO DE OBRA
export async function saveLog(fd: FormData) {
  const m = await requireMember();
  const obraId = str(fd, "obraId");
  await ownObra(obraId, m.id, m.email);
  await db.obraLog.create({
    data: {
      obraId,
      title: str(fd, "title"),
      note: str(fd, "note") || null,
      photo: str(fd, "photo") || null,
      date: date(fd, "date") ?? new Date(),
    },
  });
  revalidatePath(`/mi-obra/${obraId}`);
}

export async function deleteLog(fd: FormData) {
  const m = await requireMember();
  const obraId = str(fd, "obraId");
  await ownObra(obraId, m.id, m.email);
  await db.obraLog.delete({ where: { id: str(fd, "id") } });
  revalidatePath(`/mi-obra/${obraId}`);
}
