import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/components/lib/utils";
import type { PageMeta } from "@/types";

interface PaginationProps {
  meta: PageMeta;
  /** Builds the href for a given page number, e.g. (p) => `/search?page=${p}` */
  href: (page: number) => string;
  className?: string;
  /** Max page numbers shown around the current page before collapsing to first/last. */
  siblingCount?: number;
}

/**
 * Page-number list with prev/next, brutalist active-page treatment matching
 * the Sidebar's active-nav-item language (border-2 + shadow-brutal-xs).
 */
export function Pagination({
  meta,
  href,
  className,
  siblingCount = 1,
}: PaginationProps) {
  const { page, totalPages } = meta;
  if (totalPages <= 1) return null;

  const pages = getPageList(page, totalPages, siblingCount);

  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-1.5", className)}
    >
      <PageLink
        href={page > 1 ? href(page - 1) : undefined}
        aria-label="Previous page"
        disabled={page <= 1}
      >
        <ChevronLeft className="size-4" aria-hidden />
      </PageLink>

      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span
            key={`ellipsis-${i}`}
            className="px-1.5 text-sm text-muted-foreground"
            aria-hidden
          >
            …
          </span>
        ) : (
          <PageLink
            key={p}
            href={p === page ? undefined : href(p)}
            active={p === page}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </PageLink>
        ),
      )}

      <PageLink
        href={page < totalPages ? href(page + 1) : undefined}
        aria-label="Next page"
        disabled={page >= totalPages}
      >
        <ChevronRight className="size-4" aria-hidden />
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  active,
  disabled,
  children,
  ...rest
}: {
  href?: string;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const base = cn(
    "flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-sm font-medium tabular-nums transition-colors",
    active
      ? "border-[3px] border-neutral-950 bg-tile-lavender text-brand-800 shadow-brutal-xs"
      : "border-2 border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
    disabled && "pointer-events-none opacity-40",
  );

  if (!href) {
    return (
      <span className={base} aria-disabled={disabled || active} {...rest}>
        {children}
      </span>
    );
  }

  return (
    <Link href={href} className={base} {...rest}>
      {children}
    </Link>
  );
}

function getPageList(
  current: number,
  total: number,
  siblingCount: number,
): (number | "ellipsis")[] {
  const totalNumbers = siblingCount * 2 + 5; // first, last, current, 2 ellipses
  if (total <= totalNumbers) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const left = Math.max(current - siblingCount, 2);
  const right = Math.min(current + siblingCount, total - 1);

  const pages: (number | "ellipsis")[] = [1];
  if (left > 2) pages.push("ellipsis");
  for (let p = left; p <= right; p++) pages.push(p);
  if (right < total - 1) pages.push("ellipsis");
  pages.push(total);

  return pages;
}
