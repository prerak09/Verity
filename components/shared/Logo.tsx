import Link from "next/link";

import { cn } from "@/components/lib/utils";

/**
 * verity.exe wordmark: a lime pixel-square with an asterisk mark + chunky
 * uppercase "VERITY". Retro brand lockup matching the reference screenshots.
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
        "group inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
    >
      <span
        aria-hidden
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-[3px] border-[3px] border-neutral-950 bg-lime text-neutral-950 [box-shadow:2px_2px_0_0_var(--color-neutral-950)] transition-transform group-hover:-translate-y-0.5"
      >
        <span className="font-pixel text-lg leading-none">*</span>
      </span>
      {iconOnly ? (
        <span className="sr-only">Verity</span>
      ) : (
        <span className="font-display text-xl font-bold uppercase tracking-[0.02em] text-neutral-950">
          Verity
        </span>
      )}
    </Link>
  );
}
