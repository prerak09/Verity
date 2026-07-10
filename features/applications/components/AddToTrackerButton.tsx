"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Plus } from "lucide-react";

import { createApplication } from "@/features/applications/actions";
import { Button } from "@/components/ui/button";
import { SignInGate } from "@/components/shared/SignInGate";

/**
 * FR-25 keeps "Apply" as an external-only deep link — Verity never collects
 * applications directly. This is the separate, explicit self-tracking action:
 * the student confirms they've applied elsewhere and wants it in their own
 * Kanban tracker (defaults to SAVED via createApplication's own default).
 */
export function AddToTrackerButton({
  internshipId,
  initialTracked,
}: {
  internshipId: string;
  initialTracked: boolean;
}) {
  const [tracked, setTracked] = useState(initialTracked);
  const [pending, setPending] = useState(false);

  async function handleClick() {
    if (tracked) return;
    setPending(true);
    const result = await createApplication({ internshipId });
    setPending(false);
    if (result.success) {
      setTracked(true);
      toast.success("Added to your tracker.");
    } else {
      toast.error(result.error.message);
    }
  }

  return (
    <SignInGate
      trigger={
        <Button type="button" variant="outline" className="mt-2 w-full">
          <Plus className="size-4" aria-hidden />
          Add to tracker
        </Button>
      }
    >
      <Button
        type="button"
        variant="outline"
        className="mt-2 w-full"
        disabled={pending || tracked}
        onClick={handleClick}
      >
        {tracked ? (
          <>
            <Check className="size-4" aria-hidden />
            In your tracker
          </>
        ) : (
          <>
            <Plus className="size-4" aria-hidden />
            Add to tracker
          </>
        )}
      </Button>
    </SignInGate>
  );
}
