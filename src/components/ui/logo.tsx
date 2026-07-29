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
      {/* Abstract architectural "Q" / compass form */}
      <path
        d="M12 27V15l8-5 8 5v12"
        stroke="#f0a500"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 20h16"
        stroke="#ffffff"
        strokeOpacity="0.55"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="20" cy="27" r="1.8" fill="#f0a500" />
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
            "font-display text-[1.05rem] font-700 font-bold tracking-tight",
            light ? "text-white" : "text-ink-900"
          )}
        >
          {site.name}
        </span>
        <span
          className={cn(
            "text-[0.62rem] font-medium uppercase tracking-[0.2em]",
            light ? "text-concrete-400" : "text-ink-400"
          )}
        >
          Estudio · Obra
        </span>
      </span>
    </span>
  );
}
