import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";

import type { CompanyCard as CompanyCardDTO } from "@/types";
import { VerifiedBadge } from "@/components/shared/VerifiedBadge";
import { FundingChip } from "@/components/shared/FundingChip";
import { tileColorClass } from "@/components/shared/CompanyCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/lib/utils";

/** Full-width detailed row for the directory's "list" view (vs. the compact grid CompanyCard). */
export function CompanyListRow({
  company,
  bookmarkSlot,
  className,
}: {
  company: CompanyCardDTO;
  bookmarkSlot?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("retro-card relative flex gap-4 p-4 sm:p-5", className)}>
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
          className={cn(
            "flex size-16 shrink-0 items-center justify-center rounded-[3px] border-[3px] border-neutral-950 font-display text-2xl font-bold text-neutral-950",
            tileColorClass(company.id),
          )}
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
        </div>
        {company.tagline && (
          <p className="mt-1 line-clamp-2 font-mono text-sm text-neutral-700">
            {company.tagline}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[0.8125rem] text-neutral-700">
          {company.categories?.[0] && <span>{company.categories[0].name}</span>}
          {company.location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3.5" aria-hidden />
              {company.location}
            </span>
          )}
          {company.fundingStage && <FundingChip stage={company.fundingStage} />}
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end justify-between gap-3">
        <div className="flex items-center gap-2">
          {company.openInternshipCount > 0 && (
            <span className="inline-flex items-center rounded-[3px] border-2 border-neutral-950 bg-lime px-2 py-0.5 font-mono text-[0.6875rem] font-bold text-neutral-950">
              Hiring
            </span>
          )}
          {bookmarkSlot}
        </div>
        <Button variant="secondary" size="sm" className="gap-1.5" render={<Link href={`/companies/${company.slug}`} />}>
          View Profile
          <ArrowRight className="size-3.5" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
