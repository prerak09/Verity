import { CompanyCardSkeleton } from "@/components/shared/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-wide px-4 py-12 sm:px-6">
      <div className="h-10 w-64 animate-pulse rounded-md bg-muted" />
      <div className="mt-3 h-4 w-80 animate-pulse rounded bg-muted" />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CompanyCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
