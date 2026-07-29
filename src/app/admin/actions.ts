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
    author: str(fd, "author") || "Juan Carlos Quattrochi",
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
