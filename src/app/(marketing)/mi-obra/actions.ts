"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getMemberSession } from "@/lib/member-auth";
import { getObraAccess } from "@/lib/obra-access";
import { materialsVariationSince } from "@/lib/price-index";
import {
  PROJECT_TYPES,
  CURRENCIES,
  type ProjectType,
} from "@/lib/obra-metrics";
import { tasksFor, progressFromTasks } from "@/lib/obra-tasks";

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

  const projectType = str(fd, "projectType");
  const currency = str(fd, "currency");
  const surface = num(fd, "surfaceM2");

  const obra = await db.obra.create({
    data: {
      memberId: m.id,
      name,
      location: str(fd, "location") || null,
      // Sólo valores permitidos: si viene cualquier otra cosa, queda sin tipo.
      projectType: PROJECT_TYPES.includes(projectType as ProjectType)
        ? projectType
        : null,
      currency: CURRENCIES.includes(currency as (typeof CURRENCIES)[number])
        ? currency
        : "ARS",
      surfaceM2: surface > 0 ? surface : null,
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

  // Presupuesto inicial: se reparte con el MISMO mecanismo que "repartir por
  // etapa" y queda congelado como línea base, para que el tablero muestre
  // números coherentes desde el primer minuto (y no una obra en $0).
  const initialBudget = num(fd, "initialBudget");
  if (initialBudget > 0) {
    const rubros = await db.obraRubro.findMany({ where: { obraId: obra.id } });
    await spreadBudget(rubros, initialBudget);
    await db.obra.update({
      where: { id: obra.id },
      data: { baselineTotal: initialBudget, baselineAt: new Date() },
    });
  }

  revalidatePath("/mi-obra");
  redirect(`/mi-obra/${obra.id}`);
}

/** Archiva la obra: se conserva íntegra, sale del listado activo. */
export async function archiveObra(fd: FormData) {
  const m = await requireMember();
  const id = str(fd, "id");
  // Archivar/restaurar es potestad de quien administra la obra.
  await manageObra(id, m.id, m.email);
  await db.obra.update({ where: { id }, data: { archivedAt: new Date() } });
  revalidatePath("/mi-obra");
  revalidatePath(`/mi-obra/${id}`);
}

export async function unarchiveObra(fd: FormData) {
  const m = await requireMember();
  const id = str(fd, "id");
  await manageObra(id, m.id, m.email);
  await db.obra.update({ where: { id }, data: { archivedAt: null } });
  revalidatePath("/mi-obra");
  revalidatePath(`/mi-obra/${id}`);
}

export async function updateObra(fd: FormData) {
  const m = await requireMember();
  const id = str(fd, "id");
  await ownObra(id, m.id, m.email);
  const projectType = str(fd, "projectType");
  const currency = str(fd, "currency");
  const surface = num(fd, "surfaceM2");
  await db.obra.update({
    where: { id },
    data: {
      name: str(fd, "name"),
      location: str(fd, "location") || null,
      projectType: PROJECT_TYPES.includes(projectType as ProjectType)
        ? projectType
        : null,
      currency: CURRENCIES.includes(currency as (typeof CURRENCIES)[number])
        ? currency
        : "ARS",
      surfaceM2: surface > 0 ? surface : null,
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

/** Cambia el estado de la obra (planificación / ejecución / pausada / terminada). */
export async function setObraStatus(fd: FormData) {
  const m = await requireMember();
  const obraId = str(fd, "obraId");
  await ownObra(obraId, m.id, m.email);
  const status = str(fd, "status");
  if (!["planificacion", "ejecucion", "pausada", "terminada"].includes(status)) return;
  await db.obra.update({ where: { id: obraId }, data: { status } });
  revalidatePath(`/mi-obra/${obraId}`);
  revalidatePath("/mi-obra");
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

/**
 * Reparte un total entre las etapas con los porcentajes típicos de obra. Las
 * etapas que agregó el usuario (ej. "Pileta") reciben el promedio de las
 * conocidas para que nunca queden en cero; después se normaliza para que la
 * suma dé exactamente el total. Lo usan el alta de obra y "repartir por etapa".
 */
async function spreadBudget(
  rubros: { id: string; name: string }[],
  total: number
) {
  const knownValues = Object.values(BUDGET_SHARES);
  const avgShare = knownValues.reduce((s, v) => s + v, 0) / knownValues.length;
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
}

/** Reparte un presupuesto total entre las etapas usando los % de referencia. */
export async function distributeBudget(fd: FormData) {
  const m = await requireMember();
  const obraId = str(fd, "obraId");
  await ownObra(obraId, m.id, m.email);
  const total = num(fd, "total");
  if (total <= 0) return;

  const rubros = await db.obraRubro.findMany({ where: { obraId } });
  if (rubros.length === 0) return;
  await spreadBudget(rubros, total);
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

// -------------------------------------------------------- CHECKLIST DE TAREAS
/**
 * Recalcula el % de la etapa a partir de sus tareas. Todo el resto del sistema
 * (avance ponderado, alertas, informe) sigue leyendo `rubro.progress`, así que
 * no hay que tocar nada más.
 */
async function syncRubroProgress(rubroId: string) {
  const tasks = await db.obraTask.findMany({
    where: { rubroId },
    select: { done: true },
  });
  if (tasks.length === 0) return; // sin tareas: se respeta el % manual
  await db.obraRubro.update({
    where: { id: rubroId },
    data: { progress: progressFromTasks(tasks) },
  });
}

/** Carga la plantilla de tareas típicas de la etapa. */
export async function seedTasks(fd: FormData) {
  const m = await requireMember();
  const obraId = str(fd, "obraId");
  await ownObra(obraId, m.id, m.email);
  const rubroId = str(fd, "rubroId");

  const rubro = await db.obraRubro.findUnique({ where: { id: rubroId } });
  if (!rubro || rubro.obraId !== obraId) return;

  const existing = await db.obraTask.count({ where: { rubroId } });
  if (existing > 0) return; // no duplicar

  const labels = tasksFor(rubro.name);
  if (labels.length === 0) return;

  await db.obraTask.createMany({
    data: labels.map((label, i) => ({ rubroId, obraId, label, order: i })),
  });
  await syncRubroProgress(rubroId);
  revalidatePath(`/mi-obra/${obraId}`);
}

export async function addTask(fd: FormData) {
  const m = await requireMember();
  const obraId = str(fd, "obraId");
  await ownObra(obraId, m.id, m.email);
  const rubroId = str(fd, "rubroId");
  const label = str(fd, "label");
  if (!label) return;

  const rubro = await db.obraRubro.findUnique({ where: { id: rubroId } });
  if (!rubro || rubro.obraId !== obraId) return;

  const count = await db.obraTask.count({ where: { rubroId } });
  await db.obraTask.create({
    data: { rubroId, obraId, label, order: count },
  });
  await syncRubroProgress(rubroId);
  revalidatePath(`/mi-obra/${obraId}`);
}

/** Tilda / destilda una tarea y actualiza el avance de la etapa. */
export async function toggleTask(fd: FormData) {
  const m = await requireMember();
  const obraId = str(fd, "obraId");
  await ownObra(obraId, m.id, m.email);
  const id = str(fd, "id");

  const task = await db.obraTask.findUnique({ where: { id } });
  if (!task || task.obraId !== obraId) return;

  await db.obraTask.update({ where: { id }, data: { done: !task.done } });
  await syncRubroProgress(task.rubroId);
  revalidatePath(`/mi-obra/${obraId}`);
}

export async function deleteTask(fd: FormData) {
  const m = await requireMember();
  const obraId = str(fd, "obraId");
  await ownObra(obraId, m.id, m.email);
  const id = str(fd, "id");

  const task = await db.obraTask.findUnique({ where: { id } });
  if (!task || task.obraId !== obraId) return;

  await db.obraTask.delete({ where: { id } });
  await syncRubroProgress(task.rubroId);
  revalidatePath(`/mi-obra/${obraId}`);
}
