import Link from "next/link";
import Image from "next/image";

import type { CompanyCard as CompanyCardDTO } from "@/types";
import { VerifiedBadge } from "@/components/shared/VerifiedBadge";
import { FundingChip } from "@/components/shared/FundingChip";
import { RemoteChip } from "@/components/shared/RemoteChip";
import { cn } from "@/components/lib/utils";

/**
 * Interactive card variant (doc §12.2/§12.9): hard border + shadow, raises
 * on hover/focus. `bookmarkSlot` is left for Phase 3.3 to inject the real
 * bookmark toggle — public/unauthenticated contexts just omit it.
 */
export function CompanyCard({
  company,
  bookmarkSlot,
  className,
}: {
  company: CompanyCardDTO;
  bookmarkSlot?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "group relative flex gap-4 rounded-xl border-2 border-border bg-card p-4 shadow-brutal-md transition-[transform,box-shadow] duration-150 hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-brutal-lg",
        className,
      )}
    >
      <Link
        href={`/companies/${company.slug}`}
        className="absolute inset-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <span className="sr-only">View {company.name}</span>
      </Link>

      {company.logoUrl ? (
        <Image
          src={company.logoUrl}
          alt=""
          width={56}
          height={56}
          className="size-14 shrink-0 rounded-md border-2 border-border object-cover"
        />
      ) : (
        <div
          aria-hidden
          className="flex size-14 shrink-0 items-center justify-center rounded-md border-2 border-border bg-muted font-display text-lg font-semibold text-muted-foreground"
        >
          {company.name.charAt(0).toUpperCase()}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-display text-base font-semibold text-foreground">
            {company.name}
          </h3>
          {company.verified && <VerifiedBadge size="sm" />}
        </div>
        {company.tagline && (
          <p className="mt-0.5 line-clamp-1 text-body-sm text-muted-foreground">
            {company.tagline}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {company.fundingStage && <FundingChip stage={company.fundingStage} />}
          {company.remotePolicy && <RemoteChip policy={company.remotePolicy} />}
          {company.openInternshipCount > 0 && (
            <span className="text-[0.6875rem] font-bold uppercase tracking-wide text-success-fg">
              {company.openInternshipCount} open
            </span>
          )}
        </div>
      </div>

      {bookmarkSlot && (
        <div className="relative z-10 shrink-0">{bookmarkSlot}</div>
      )}
    </div>
  );
}
