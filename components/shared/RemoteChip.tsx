import { Wifi, Building2, Shuffle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { RemotePolicy } from "@/types";
import { cn } from "@/components/lib/utils";

const REMOTE_META: Record<RemotePolicy, { label: string; icon: LucideIcon }> = {
  REMOTE: { label: "Remote", icon: Wifi },
  HYBRID: { label: "Hybrid", icon: Shuffle },
  ONSITE: { label: "Onsite", icon: Building2 },
};

/** Neutral outline chip (doc §12.9 "outline" variant) — a low-emphasis tag, not a status. */
export function RemoteChip({
  policy,
  className,
}: {
  policy: RemotePolicy;
  className?: string;
}) {
  const { label, icon: Icon } = REMOTE_META[policy];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm border-[3px] border-neutral-950 bg-transparent px-2 py-0.5 text-[0.6875rem] font-bold uppercase tracking-[0.04em] text-foreground",
        className,
      )}
    >
      <Icon className="size-3" strokeWidth={2.5} aria-hidden />
      {label}
    </span>
  );
}
