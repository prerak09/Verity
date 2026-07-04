"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";

import { toggleBookmark } from "@/features/bookmarks/actions";
import type { BookmarkTargetType } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/lib/utils";

export function BookmarkButton({
  targetType,
  targetId,
  initialBookmarked,
  onToggle,
  className,
}: {
  targetType: BookmarkTargetType;
  targetId: string;
  initialBookmarked: boolean;
  /** Fired after a confirmed (non-optimistic) state change — e.g. the
   * Bookmarks page (3.4) uses this to drop the row on unbookmark. */
  onToggle?: (bookmarked: boolean) => void;
  className?: string;
}) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [pending, setPending] = useState(false);

  async function handleClick() {
    const next = !bookmarked;
    setBookmarked(next); // optimistic
    setPending(true);

    // Real Server Action (features/bookmarks/actions.ts) — same
    // graceful-degradation pattern as 3.2's ProfileForm: handleAction()
    // turns a DB failure into a clean Result, never a crash.
    const result = await toggleBookmark({ targetType, targetId });

    setPending(false);

    if (result.success) {
      setBookmarked(result.data.bookmarked);
      onToggle?.(result.data.bookmarked);
    } else {
      setBookmarked(!next); // revert
      toast.error(result.error.message);
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      disabled={pending}
      onClick={handleClick}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
      className={cn(bookmarked && "border-brand-600 text-brand-700", className)}
    >
      <Bookmark
        className="size-4"
        fill={bookmarked ? "currentColor" : "none"}
        aria-hidden
      />
    </Button>
  );
}
