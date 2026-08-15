"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getMemberSession } from "@/lib/member-auth";

async function requireMember() {
  const session = await getMemberSession();
  if (!session) redirect("/ingresar");
  return session;
}

/** Verifica que la obra sea del usuario logueado. */
async function ownObra(obraId: string, memberId: string) {
  const obra = await db.obra.findUnique({ where: { id: obraId } });
  if (!obra || obra.memberId !== memberId) redirect("/mi-obra");
  return obra;
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
  await ownObra(id, m.id);
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
  await ownObra(id, m.id);
  await db.obra.delete({ where: { id } });
  revalidatePath("/mi-obra");
  redirect("/mi-obra");
}

// ------------------------------------------------------------------ RUBROS
export async function saveRubro(fd: FormData) {
  const m = await requireMember();
  const obraId = str(fd, "obraId");
  await ownObra(obraId, m.id);
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

export async function deleteRubro(fd: FormData) {
  const m = await requireMember();
  const obraId = str(fd, "obraId");
  await ownObra(obraId, m.id);
  await db.obraRubro.delete({ where: { id: str(fd, "id") } });
  revalidatePath(`/mi-obra/${obraId}`);
}

// --------------------------------------------------------------- MATERIALES
export async function saveMaterial(fd: FormData) {
  const m = await requireMember();
  const obraId = str(fd, "obraId");
  await ownObra(obraId, m.id);
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
  await ownObra(obraId, m.id);
  await db.obraMaterial.update({
    where: { id: str(fd, "id") },
    data: { status: str(fd, "status") },
  });
  revalidatePath(`/mi-obra/${obraId}`);
}

export async function deleteMaterial(fd: FormData) {
  const m = await requireMember();
  const obraId = str(fd, "obraId");
  await ownObra(obraId, m.id);
  await db.obraMaterial.delete({ where: { id: str(fd, "id") } });
  revalidatePath(`/mi-obra/${obraId}`);
}

// ------------------------------------------------------------------ GASTOS
export async function saveExpense(fd: FormData) {
  const m = await requireMember();
  const obraId = str(fd, "obraId");
  await ownObra(obraId, m.id);
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
  await ownObra(obraId, m.id);
  await db.obraExpense.delete({ where: { id: str(fd, "id") } });
  revalidatePath(`/mi-obra/${obraId}`);
}

// ------------------------------------------------------------ LIBRO DE OBRA
export async function saveLog(fd: FormData) {
  const m = await requireMember();
  const obraId = str(fd, "obraId");
  await ownObra(obraId, m.id);
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
  await ownObra(obraId, m.id);
  await db.obraLog.delete({ where: { id: str(fd, "id") } });
  revalidatePath(`/mi-obra/${obraId}`);
}
