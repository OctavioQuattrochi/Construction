import { Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";

// Slot reutilizable para publicidad incrustada. Si recibe `href`/`image` muestra
// el aviso real; si no, muestra un placeholder listo para vender el espacio.
export function AdSlot({
  size = "banner",
  href,
  image,
  alt,
  label = "Espacio publicitario",
  className,
}: {
  size?: "banner" | "box" | "leaderboard";
  href?: string;
  image?: string;
  alt?: string;
  label?: string;
  className?: string;
}) {
  const dims: Record<string, string> = {
    banner: "aspect-[8/1] min-h-[90px]",
    leaderboard: "aspect-[970/250] min-h-[120px]",
    box: "aspect-[4/3] min-h-[240px]",
  };

  if (image && href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={cn("block overflow-hidden rounded-2xl border border-ink-100", className)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={alt || "Publicidad"} className="h-full w-full object-cover" />
      </a>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-ink-200 bg-concrete-50 text-center",
        dims[size],
        className
      )}
    >
      <Megaphone className="h-5 w-5 text-ink-300" />
      <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
        {label}
      </p>
      <p className="text-[0.7rem] text-ink-300">Tu marca acá · consultanos</p>
    </div>
  );
}
