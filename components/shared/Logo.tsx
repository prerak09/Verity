import Link from "next/link";
import { BadgeCheck } from "lucide-react";

import { cn } from "@/components/lib/utils";

/**
 * The wordmark lockup (doc §2.1): the mark *is* a verified badge — brand and
 * trust signal are the same object by design (principle P5). Never recolor
 * the glyph square; it borrows the reserved --verified-fill/--verified-ring
 * pair, not the brand scale.
 */
export function Logo({
  href = "/",
  className,
  iconOnly = false,
}: {
  href?: string;
  className?: string;
  iconOnly?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <span
        aria-hidden
        className="inline-flex size-7 shrink-0 items-center justify-center rounded-md border-2 shadow-brutal-xs"
        style={{
          background: "var(--verified-fill)",
          borderColor: "var(--verified-ring)",
        }}
      >
        <BadgeCheck className="size-4 text-white" strokeWidth={3} />
      </span>
      {iconOnly ? (
        <span className="sr-only">Verity</span>
      ) : (
        <span className="font-display text-lg font-extrabold tracking-[-0.02em] text-foreground">
          Verity
        </span>
      )}
    </Link>
  );
}
