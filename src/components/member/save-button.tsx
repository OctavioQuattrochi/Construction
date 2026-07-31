"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Heart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SaveItemInput {
  type: "property" | "professional" | "material" | "article";
  refId: string;
  title: string;
  subtitle?: string;
  href?: string;
  image?: string;
}

export function SaveButton({
  item,
  initialSaved = false,
  isMember,
  variant = "icon",
  className,
}: {
  item: SaveItemInput;
  initialSaved?: boolean;
  isMember: boolean;
  variant?: "icon" | "chip";
  className?: string;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!isMember) {
      toast.info("Iniciá sesión para guardar favoritos.");
      router.push("/ingresar");
      return;
    }
    setLoading(true);
    // Optimista
    const next = !saved;
    setSaved(next);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Error");
      setSaved(json.saved);
      toast.success(json.saved ? "Guardado en favoritos" : "Quitado de favoritos");
    } catch {
      setSaved(!next); // revertir
      toast.error("No se pudo guardar. Probá de nuevo.");
    } finally {
      setLoading(false);
      router.refresh();
    }
  }

  if (variant === "chip") {
    return (
      <button
        onClick={toggle}
        disabled={loading}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
          saved
            ? "border-rose-300 bg-rose-50 text-rose-600"
            : "border-ink-200 text-ink-600 hover:border-ink-400",
          className
        )}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Heart className={cn("h-4 w-4", saved && "fill-rose-500 text-rose-500")} />
        )}
        {saved ? "Guardado" : "Guardar"}
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={saved ? "Quitar de favoritos" : "Guardar en favoritos"}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border bg-white/90 backdrop-blur transition-colors",
        saved ? "border-rose-200 text-rose-500" : "border-ink-200 text-ink-500 hover:text-rose-500",
        className
      )}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Heart className={cn("h-[1.15rem] w-[1.15rem]", saved && "fill-rose-500")} />
      )}
    </button>
  );
}
