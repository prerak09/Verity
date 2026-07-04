"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Shared body for every route group's error.tsx (TRD §21). Next.js places
 * error.tsx *inside* that segment's layout.tsx, so the surrounding
 * Navbar/Sidebar chrome stays intact automatically — this only needs to
 * fill the content area.
 */
export function RouteErrorFallback({
  error,
  reset,
  compact = false,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  compact?: boolean;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className={
        compact
          ? "flex flex-col items-center justify-center gap-3 py-16 text-center"
          : "flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center"
      }
    >
      <div className="flex size-14 items-center justify-center rounded-xl border-2 border-error-border bg-error-bg shadow-brutal-sm">
        <AlertTriangle className="size-7 text-error-fg" strokeWidth={1.75} aria-hidden />
      </div>
      <div>
        <h2 className="font-display text-h3 text-foreground">
          Something broke on our end
        </h2>
        <p className="mt-1 max-w-sm text-body-sm text-muted-foreground">
          We&apos;ve logged it.
          {error.digest && (
            <>
              {" "}
              Reference: <span className="font-mono">{error.digest}</span>
            </>
          )}
        </p>
      </div>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
