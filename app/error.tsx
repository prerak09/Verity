"use client";

import { RouteErrorFallback } from "@/components/shared/RouteErrorFallback";

/**
 * Root error boundary (TRD §21) — last-resort fallback if a route group's
 * own error.tsx doesn't catch it first.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RouteErrorFallback error={error} reset={reset} />;
}
