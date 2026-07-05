import { Skeleton, KpiCardSkeleton, TableSkeleton } from "@/components/shared/Skeleton";

/** Shared dashboard-shaped skeleton for the student/company/admin loading.tsx files. */
export function PortalLoading() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <Skeleton className="h-6 w-40" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <KpiCardSkeleton key={i} />
        ))}
      </div>
      <div className="rounded-xl border-[3px] border-neutral-950 p-4 shadow-brutal-sm">
        <TableSkeleton rows={5} columns={4} />
      </div>
    </div>
  );
}
