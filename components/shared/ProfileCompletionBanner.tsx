"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Skippable "complete your profile" nudge with a % meter. Dismissal is stored
 * in localStorage so it doesn't nag every visit. Hidden entirely at 100%.
 */
export function ProfileCompletionBanner({ percent }: { percent: number }) {
  const [dismissed, setDismissed] = useState(false);

  if (percent >= 100 || dismissed) return null;

  return (
    <div className="relative flex flex-col gap-3 rounded-[4px] border-[3px] border-neutral-950 bg-tile-yellow p-4 [box-shadow:4px_4px_0_0_var(--color-neutral-950)] sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-2 text-neutral-700 hover:text-neutral-950"
      >
        <X className="size-4" strokeWidth={3} />
      </button>

      <div className="min-w-0 flex-1 pr-6">
        <p className="font-display text-base font-bold text-neutral-950">
          Complete your profile ({percent}%)
        </p>
        <p className="mt-0.5 font-mono text-sm text-neutral-800">
          Add your skills, interests, and education so companies can find you.
        </p>
        <div className="mt-2 h-2.5 w-full max-w-sm overflow-hidden rounded-full border-2 border-neutral-950 bg-card">
          <div
            className="h-full bg-lime transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <Button
        size="sm"
        variant="outline"
        className="shrink-0"
        render={<Link href="/dashboard/profile" />}
      >
        Finish profile <ArrowRight className="size-3.5" />
      </Button>
    </div>
  );
}
