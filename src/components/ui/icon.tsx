import {
  Compass,
  ClipboardCheck,
  PencilRuler,
  HardHat,
  Building2,
  Ruler,
  Hammer,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const map: Record<string, LucideIcon> = {
  Compass,
  ClipboardCheck,
  PencilRuler,
  HardHat,
  Building2,
  Ruler,
  Hammer,
  Layers,
};

export function DynamicIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = map[name] ?? HardHat;
  return <Icon className={cn("h-6 w-6", className)} />;
}
