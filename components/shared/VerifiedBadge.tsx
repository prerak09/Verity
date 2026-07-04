import { BadgeCheck } from "lucide-react";

import { cn } from "@/components/lib/utils";

function formatVerifiedDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * The sacred badge (doc §3.6 / §12.9, PRD P5): a fixed, reserved color pairing
 * that appears nowhere else in the system, so it can never be confused with
 * an ordinary UI element. Never recolor it — it always uses
 * --verified-fill/--verified-ring, not the brand scale.
 */
export function VerifiedBadge({
  date,
  size = "md",
  className,
}: {
  /** ISO lastVerifiedAt (PRD §13.7) — shown in the tooltip when known. */
  date?: string | null;
  size?: "sm" | "md";
  className?: string;
}) {
  const label = `Verified by Verity${date ? ` on ${formatVerifiedDate(date)}` : ""}`;

  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md border-2 shadow-brutal-xs",
        size === "sm" ? "size-5" : "size-6",
        className,
      )}
      style={{
        background: "var(--verified-fill)",
        borderColor: "var(--verified-ring)",
      }}
    >
      <BadgeCheck
        className={size === "sm" ? "size-3 text-white" : "size-3.5 text-white"}
        strokeWidth={3}
        aria-hidden
      />
    </span>
  );
}
