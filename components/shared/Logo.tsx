import Link from "next/link";
import { Asterisk } from "lucide-react";

import { cn } from "@/components/lib/utils";

/**
 * Retro-rebrand wordmark: lime square + asterisk mark, bold tracked-tight
 * uppercase mono wordmark.
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
        className="inline-flex size-7 shrink-0 items-center justify-center rounded-md border-2 border-border bg-butter-300 shadow-brutal-xs"
      >
        <Asterisk className="size-4 text-foreground" strokeWidth={3} />
      </span>
      {iconOnly ? (
        <span className="sr-only">Verity</span>
      ) : (
        <span className="font-display text-lg font-bold tracking-[-0.01em] text-foreground uppercase">
          Verity
        </span>
      )}
    </Link>
  );
}
