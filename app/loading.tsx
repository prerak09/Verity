import { Skeleton } from "@/components/shared/Skeleton";

/** Root Suspense fallback — route groups define their own, more specific loading.tsx. */
export default function RootLoading() {
  return (
    <div className="mx-auto flex w-full max-w-app flex-1 flex-col gap-4 px-4 py-10 sm:px-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-72" />
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    </div>
  );
}
