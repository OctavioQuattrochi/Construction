import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("h-9 w-9", className)}
      aria-hidden
      fill="none"
    >
      <rect width="40" height="40" rx="10" fill="#0c0f14" />
      {/* Building blocks ascending — "build up" */}
      <rect x="10" y="22" width="6" height="8" rx="1.4" fill="#ffffff" fillOpacity="0.55" />
      <rect x="17" y="17" width="6" height="13" rx="1.4" fill="#f0a500" />
      <rect x="24" y="11" width="6" height="19" rx="1.4" fill="#ffab20" />
    </svg>
  );
}

export function Logo({
  className,
  light = false,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[1.15rem] font-bold tracking-tight",
            light ? "text-white" : "text-ink-900"
          )}
        >
          Bild<span className="text-amber-500">Ap</span>
        </span>
        <span
          className={cn(
            "mt-0.5 text-[0.6rem] font-medium uppercase tracking-[0.2em]",
            light ? "text-concrete-400" : "text-ink-400"
          )}
        >
          Construcción
        </span>
      </span>
    </span>
  );
}
