"use client";

import { RouteErrorFallback } from "@/components/shared/RouteErrorFallback";

export default function MarketingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteErrorFallback error={error} reset={reset} />;
}
