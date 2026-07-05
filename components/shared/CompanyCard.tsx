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
      className={cn("retro-card retro-hover group relative flex gap-4 p-4", className)}
    >
      <Link
        href={`/companies/${company.slug}`}
        className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <span className="sr-only">View {company.name}</span>
      </Link>

      {company.logoUrl ? (
        <Image
          src={company.logoUrl}
          alt=""
          width={64}
          height={64}
          className="size-16 shrink-0 rounded-[3px] border-[3px] border-neutral-950 object-cover"
        />
      ) : (
        <div
          aria-hidden
          className="flex size-16 shrink-0 items-center justify-center rounded-[3px] border-[3px] border-neutral-950 bg-tile-lavender font-display text-2xl font-bold text-neutral-950"
        >
          {company.name.charAt(0).toUpperCase()}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-display text-lg font-bold text-neutral-950">
            {company.name}
          </h3>
          {company.verified && <VerifiedBadge size="sm" />}
          {company.openInternshipCount > 0 && (
            <span className="ml-auto hidden items-center rounded-[3px] border-2 border-neutral-950 bg-lime px-2 py-0.5 font-mono text-[0.6875rem] font-bold text-neutral-950 sm:inline-flex">
              {company.openInternshipCount} Hiring
            </span>
          )}
        </div>
        {company.tagline && (
          <p className="mt-1 line-clamp-2 font-mono text-sm text-neutral-700">
            {company.tagline}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {company.categories?.[0] && (
            <span className="inline-flex items-center rounded-[3px] border-2 border-neutral-950 bg-card px-2 py-0.5 font-mono text-[0.6875rem] font-bold text-neutral-800">
              {company.categories[0].name}
            </span>
          )}
          {company.fundingStage && <FundingChip stage={company.fundingStage} />}
          {company.remotePolicy && <RemoteChip policy={company.remotePolicy} />}
        </div>
      </div>

      {bookmarkSlot && (
        <div className="relative z-10 shrink-0">{bookmarkSlot}</div>
      )}
    </div>
  );
}
