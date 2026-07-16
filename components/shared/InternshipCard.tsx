import Link from "next/link";

import type { InternshipCard as InternshipCardDTO } from "@/types";
import { RemoteChip } from "@/components/shared/RemoteChip";
import { CompanyLogo } from "@/components/shared/CompanyLogo";
import { SEASON_LABEL } from "@/config/seasons";
import { cn } from "@/components/lib/utils";

/**
 * Same interactive-card language as CompanyCard (doc §12.2). `hideCompany`
 * suppresses the company lockup when the card already lives on that
 * company's own profile page (1.3) to avoid redundant repetition.
 */
export function InternshipCard({
  internship,
  hideCompany = false,
  bookmarkSlot,
  className,
}: {
  internship: InternshipCardDTO;
  hideCompany?: boolean;
  bookmarkSlot?: React.ReactNode;
  className?: string;
}) {
  const archived = internship.status === "ARCHIVED";

  return (
    <div
      className={cn(
        "retro-card retro-hover group relative flex gap-4 p-4",
        archived && "opacity-70 grayscale-[35%]",
        className,
      )}
    >
      <Link
        href={`/internships/${internship.slug}`}
        className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <span className="sr-only">View {internship.title}</span>
      </Link>

      {!hideCompany && (
        <CompanyLogo
          src={internship.companyLogoUrl}
          name={internship.companyName}
          seed={internship.companyId}
          size={48}
        />
      )}

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-display text-base font-bold text-neutral-950">
          {internship.title}
        </h3>
        {!hideCompany && (
          <p className="mt-0.5 line-clamp-1 text-body-sm text-muted-foreground">
            {internship.companyName}
            {internship.location && ` · ${internship.location}`}
          </p>
        )}
        {hideCompany && internship.location && (
          <p className="mt-0.5 line-clamp-1 text-body-sm text-muted-foreground">
            {internship.location}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {archived ? (
            // Bookmark/tracker entries persist after a company archives the
            // role — never silently break the link, always say so (doc §23).
            <span className="inline-flex items-center rounded-sm border-[3px] border-neutral-950 bg-muted px-2 py-0.5 text-[0.6875rem] font-bold uppercase tracking-[0.04em] text-muted-foreground">
              No longer open
            </span>
          ) : (
            <>
              {internship.remotePolicy && <RemoteChip policy={internship.remotePolicy} />}
              {internship.forWomen && (
                <span className="inline-flex items-center rounded-sm border-2 border-neutral-950 bg-tile-pink px-2 py-0.5 text-[0.6875rem] font-bold uppercase tracking-[0.04em] text-neutral-950">
                  For Women
                </span>
              )}
              {internship.season && (
                <span className="inline-flex items-center rounded-sm border-2 border-neutral-950 bg-tile-lavender px-2 py-0.5 text-[0.6875rem] font-bold uppercase tracking-[0.04em] text-neutral-950">
                  {SEASON_LABEL[internship.season]}
                </span>
              )}
              {internship.stipend && (
                <span className="text-body-sm font-medium text-foreground">
                  {internship.stipend}
                </span>
              )}
              {internship.isStale && (
                <span className="inline-flex items-center rounded-sm border-2 border-warning-border bg-warning-bg px-2 py-0.5 text-[0.6875rem] font-bold uppercase tracking-[0.04em] text-warning-fg">
                  Still open?
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {bookmarkSlot && (
        <div className="relative z-10 shrink-0">{bookmarkSlot}</div>
      )}
    </div>
  );
}
