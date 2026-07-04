import { cn } from "@/components/lib/utils";

/**
 * Brutalist skeleton (doc §14): a bordered wireframe of the real component,
 * not a soft gray pill. Mirror the final layout's exact dimensions so
 * there's no reflow when content swaps in.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-shimmer rounded-md border-2 border-border-subtle bg-neutral-100 bg-[length:200%_100%] motion-reduce:animate-none",
        className,
      )}
      style={{
        backgroundImage:
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
      }}
    />
  );
}

/** Matches CompanyCard's composite dimensions (doc §14.3 / §12.2). */
export function CompanyCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-xl border-2 border-border p-4 shadow-brutal-md">
      <Skeleton className="size-14 shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-3/4" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-14" />
        </div>
      </div>
    </div>
  );
}

/** Generic row-based table skeleton — header renders real (it's static). */
export function TableSkeleton({
  rows = 6,
  columns = 4,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="flex gap-3">
          {Array.from({ length: columns }).map((_, col) => (
            <Skeleton key={col} className="h-8 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Big-number KPI card skeleton (doc §14.3). */
export function KpiCardSkeleton() {
  return (
    <div className="space-y-2 rounded-xl border-2 border-border p-4 shadow-brutal-sm">
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-8 w-24" />
    </div>
  );
}
