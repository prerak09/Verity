"use client";

import { useState } from "react";
import { toast } from "sonner";

import { updateEmailNotifications } from "@/features/settings/actions";
import { cn } from "@/components/lib/utils";

export function SettingsForm({
  initialEmailNotificationsEnabled,
}: {
  initialEmailNotificationsEnabled: boolean;
}) {
  const [enabled, setEnabled] = useState(initialEmailNotificationsEnabled);
  const [pending, setPending] = useState(false);

  async function handleToggle() {
    const next = !enabled;
    setEnabled(next); // optimistic
    setPending(true);

    const result = await updateEmailNotifications(next);

    setPending(false);

    if (result.success) {
      toast.success(next ? "Email notifications on" : "Email notifications off");
    } else {
      setEnabled(!next); // revert
      toast.error(result.error.message);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="retro-card flex items-center justify-between gap-4 p-4">
        <div>
          <p className="font-medium text-foreground">Email notifications</p>
          <p className="mt-0.5 text-body-sm text-muted-foreground">
            Get emailed about application updates, new matching internships, and
            account activity.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label="Toggle email notifications"
          disabled={pending}
          onClick={handleToggle}
          className={cn(
            "relative h-7 w-12 shrink-0 rounded-full border-[3px] border-neutral-950 transition-colors disabled:opacity-50",
            enabled ? "bg-lime" : "bg-muted",
          )}
        >
          <span
            className={cn(
              "absolute top-1/2 size-4 -translate-y-1/2 rounded-full border-2 border-neutral-950 bg-card transition-[left]",
              enabled ? "left-[calc(100%-1.35rem)]" : "left-1",
            )}
          />
        </button>
      </div>
    </div>
  );
}
