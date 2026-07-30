"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { slugify, readingTime } from "@/lib/utils";

async function guard() {
  await requireSession();
}

function str(fd: FormData, key: string): string {
  return (fd.get(key)?.toString() ?? "").trim();
}
function bool(fd: FormData, key: string): boolean {
  return fd.get(key) === "on" || fd.get(key) === "true";
}

// ------------------------------------------------------------- ARTICLES
export async function saveArticle(fd: FormData) {
  await guard();
  const id = str(fd, "id");
  const title = str(fd, "title");
  const slug = slugify(str(fd, "slug") || title);
  const content = str(fd, "content");

  const data = {
    title,
    slug,
    excerpt: str(fd, "excerpt"),
    content,
    coverImage: str(fd, "coverImage") || null,
    categoryId: str(fd, "categoryId") || null,
    tags: str(fd, "tags"),
    author: str(fd, "author") || "Equipo BildAp",
    readMinutes: Number(str(fd, "readMinutes")) || readingTime(content),
    featured: bool(fd, "featured"),
    published: bool(fd, "published"),
  };

  if (id) {
    await db.article.update({ where: { id }, data });
  } else {
    await db.article.create({ data });
  }

  revalidatePath("/admin/articulos");
  revalidatePath("/conocimiento");
  revalidatePath(`/conocimiento/${slug}`);
  redirect("/admin/articulos");
}

export async function deleteArticle(fd: FormData) {
  await guard();
  const id = str(fd, "id");
  if (id) await db.article.delete({ where: { id } });
  revalidatePath("/admin/articulos");
  revalidatePath("/conocimiento");
}

// ------------------------------------------------------------- CATEGORIES
export async function saveCategory(fd: FormData) {
  await guard();
  const id = str(fd, "id");
  const name = str(fd, "name");
  const data = {
    name,
    slug: slugify(str(fd, "slug") || name),
    description: str(fd, "description") || null,
    color: str(fd, "color") || "#f0a500",
  };
  if (id) {
    await db.category.update({ where: { id }, data });
  } else {
    await db.category.create({ data });
  }
  revalidatePath("/admin/categorias");
  revalidatePath("/conocimiento");
  redirect("/admin/categorias");
}

export async function deleteCategory(fd: FormData) {
  await guard();
  const id = str(fd, "id");
  if (id) await db.category.delete({ where: { id } });
  revalidatePath("/admin/categorias");
  revalidatePath("/conocimiento");
}

// ------------------------------------------------------------- SERVICES
export async function saveService(fd: FormData) {
  await guard();
  const id = str(fd, "id");
  const title = str(fd, "title");
  const data = {
    title,
    slug: slugify(str(fd, "slug") || title),
    summary: str(fd, "summary"),
    description: str(fd, "description"),
    icon: str(fd, "icon") || "HardHat",
    features: str(fd, "features"),
    order: Number(str(fd, "order")) || 0,
    published: bool(fd, "published"),
  };
  if (id) {
    await db.service.update({ where: { id }, data });
  } else {
    await db.service.create({ data });
  }
  revalidatePath("/admin/servicios");
  revalidatePath("/");
  redirect("/admin/servicios");
}

export async function deleteService(fd: FormData) {
  await guard();
  const id = str(fd, "id");
  if (id) await db.service.delete({ where: { id } });
  revalidatePath("/admin/servicios");
  revalidatePath("/");
}

// ------------------------------------------------------------- PROFESSIONALS
export async function saveProfessional(fd: FormData) {
  await guard();
  const id = str(fd, "id");
  const name = str(fd, "name");
  const data = {
    name,
    slug: slugify(str(fd, "slug") || name),
    profession: str(fd, "profession"),
    bio: str(fd, "bio"),
    photo: str(fd, "photo") || null,
    location: str(fd, "location") || "Córdoba",
    phone: str(fd, "phone") || null,
    whatsapp: str(fd, "whatsapp") || null,
    email: str(fd, "email") || null,
    specialties: str(fd, "specialties"),
    featured: bool(fd, "featured"),
    active: bool(fd, "active"),
    order: Number(str(fd, "order")) || 0,
  };
  if (id) {
    await db.professional.update({ where: { id }, data });
  } else {
    await db.professional.create({ data });
  }
  revalidatePath("/admin/profesionales");
  revalidatePath("/profesionales");
  redirect("/admin/profesionales");
}

export async function deleteProfessional(fd: FormData) {
  await guard();
  const id = str(fd, "id");
  if (id) await db.professional.delete({ where: { id } });
  revalidatePath("/admin/profesionales");
  revalidatePath("/profesionales");
}

// ------------------------------------------------------------- PROPERTIES
export async function saveProperty(fd: FormData) {
  await guard();
  const id = str(fd, "id");
  const title = str(fd, "title");
  const priceRaw = str(fd, "price");
  const data = {
    title,
    slug: slugify(str(fd, "slug") || title),
    operation: str(fd, "operation") || "venta",
    type: str(fd, "type") || "casa",
    price: priceRaw ? Number(priceRaw) : null,
    currency: str(fd, "currency") || "USD",
    location: str(fd, "location"),
    bedrooms: str(fd, "bedrooms") ? Number(str(fd, "bedrooms")) : null,
    bathrooms: str(fd, "bathrooms") ? Number(str(fd, "bathrooms")) : null,
    area: str(fd, "area") ? Number(str(fd, "area")) : null,
    coverImage: str(fd, "coverImage") || null,
    images: str(fd, "images"),
    description: str(fd, "description"),
    agency: str(fd, "agency"),
    phone: str(fd, "phone") || null,
    whatsapp: str(fd, "whatsapp") || null,
    featured: bool(fd, "featured"),
    published: bool(fd, "published"),
  };
  if (id) {
    await db.property.update({ where: { id }, data });
  } else {
    await db.property.create({ data });
  }
  revalidatePath("/admin/inmuebles");
  revalidatePath("/inmuebles");
  redirect("/admin/inmuebles");
}

export async function deleteProperty(fd: FormData) {
  await guard();
  const id = str(fd, "id");
  if (id) await db.property.delete({ where: { id } });
  revalidatePath("/admin/inmuebles");
  revalidatePath("/inmuebles");
}

// ------------------------------------------------------------- MESSAGES
export async function toggleMessage(fd: FormData) {
  await guard();
  const id = str(fd, "id");
  const handled = bool(fd, "handled");
  if (id) await db.contactMessage.update({ where: { id }, data: { handled } });
  revalidatePath("/admin/mensajes");
}

export async function deleteMessage(fd: FormData) {
  await guard();
  const id = str(fd, "id");
  if (id) await db.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/mensajes");
}
