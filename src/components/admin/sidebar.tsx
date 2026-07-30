"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  FolderTree,
  Wrench,
  Inbox,
  Users,
  Building2,
  Mail,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { LogoMark } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Panel", icon: LayoutDashboard, exact: true },
  { href: "/admin/articulos", label: "Artículos", icon: FileText },
  { href: "/admin/categorias", label: "Categorías", icon: FolderTree },
  { href: "/admin/servicios", label: "Servicios", icon: Wrench },
  { href: "/admin/profesionales", label: "Profesionales", icon: Users },
  { href: "/admin/inmuebles", label: "Inmuebles", icon: Building2 },
  { href: "/admin/mensajes", label: "Mensajes", icon: Inbox },
  { href: "/admin/suscriptores", label: "Suscriptores", icon: Mail },
];

export function Sidebar({ user }: { user: { name: string; email: string } }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const nav = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 px-2 py-2">
        <LogoMark className="h-9 w-9" />
        <div className="leading-none">
          <p className="font-display text-sm font-bold text-white">Admin</p>
          <p className="text-[0.65rem] uppercase tracking-widest text-concrete-500">
            BildAp
          </p>
        </div>
      </div>

      <nav className="mt-8 flex-1 space-y-1">
        {links.map((l) => {
          const active = l.exact
            ? pathname === l.href
            : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-white/10 text-white"
                  : "text-concrete-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <l.icon
                className={cn("h-[1.15rem] w-[1.15rem]", active && "text-amber-400")}
              />
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-white/10 pt-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-concrete-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <ExternalLink className="h-[1.15rem] w-[1.15rem]" />
          Ver sitio
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-concrete-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut className="h-[1.15rem] w-[1.15rem]" />
          Cerrar sesión
        </button>
        <div className="mt-3 rounded-xl bg-white/5 px-3 py-2.5">
          <p className="truncate text-sm font-medium text-white">{user.name}</p>
          <p className="truncate text-xs text-concrete-500">{user.email}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-ink-100 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <LogoMark className="h-8 w-8" />
          <span className="font-display font-bold text-ink-900">Admin</span>
        </div>
        <button onClick={() => setOpen(true)} className="p-1 text-ink-700">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-ink-950 p-4 lg:flex">
        {nav}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-950/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-ink-950 p-4">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-concrete-400"
            >
              <X className="h-5 w-5" />
            </button>
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
