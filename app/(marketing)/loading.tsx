import { Skeleton, CompanyCardSkeleton } from "@/components/shared/Skeleton";

export default function MarketingLoading() {
  return (
    <div className="mx-auto flex w-full max-w-wide flex-col gap-6 px-4 py-12 sm:px-6">
      <Skeleton className="h-10 w-72" />
      <Skeleton className="h-4 w-96 max-w-full" />
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CompanyCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
