import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/components/lib/utils";

interface EmptyStateAction {
  label: string;
  href: string;
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  compact?: boolean;
  className?: string;
}

/**
 * Empty states are never dead ends (doc §13 / PRD §16, §23): icon + title +
 * one-line description + a primary action pointing somewhere useful.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  compact = false,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center",
        compact ? "py-8" : "py-16",
        className,
      )}
    >
      <div className="flex size-16 items-center justify-center rounded-[3px] border-[3px] border-neutral-950 bg-tile-lavender [box-shadow:3px_3px_0_0_var(--color-neutral-950)]">
        <Icon className="size-7 text-neutral-950" strokeWidth={2} aria-hidden />
      </div>
      <h4 className="mt-5 font-display text-lg font-bold text-neutral-950">
        {title}
      </h4>
      <p className="mt-1 max-w-sm text-body-sm text-muted-foreground">
        {description}
      </p>
      {(action || secondaryAction) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {action && (
            <Button size="sm" render={<Link href={action.href} />}>
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="ghost"
              size="sm"
              render={<Link href={secondaryAction.href} />}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
