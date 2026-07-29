import { cn } from "@/lib/utils";

export function Badge({
  children,
  className,
  color,
}: {
  children: React.ReactNode;
  className?: string;
  color?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-ink-100 bg-ink-50 px-3 py-1 text-xs font-medium text-ink-600",
        className
      )}
      style={
        color
          ? { color, backgroundColor: `${color}14`, borderColor: `${color}33` }
          : undefined
      }
    >
      {children}
    </span>
  );
}

export function Dot({ color = "#22c55e" }: { color?: string }) {
  return (
    <span className="relative flex h-2 w-2">
      <span
        className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
        style={{ backgroundColor: color }}
      />
      <span
        className="relative inline-flex h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
      />
    </span>
  );
}
