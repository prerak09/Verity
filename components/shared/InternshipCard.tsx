import Link from "next/link";
import Image from "next/image";
import { Briefcase } from "lucide-react";

import type { InternshipCard as InternshipCardDTO } from "@/types";
import { RemoteChip } from "@/components/shared/RemoteChip";
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
  return (
    <div
      className={cn(
        "group relative flex gap-4 rounded-xl border-2 border-border bg-card p-4 shadow-brutal-md transition-[transform,box-shadow] duration-150 hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-brutal-lg",
        className,
      )}
    >
      <Link
        href={`/internships/${internship.slug}`}
        className="absolute inset-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <span className="sr-only">View {internship.title}</span>
      </Link>

      {!hideCompany && (
        <>
          {internship.companyLogoUrl ? (
            <Image
              src={internship.companyLogoUrl}
              alt=""
              width={48}
              height={48}
              className="size-12 shrink-0 rounded-md border-2 border-border object-cover"
            />
          ) : (
            <div
              aria-hidden
              className="flex size-12 shrink-0 items-center justify-center rounded-md border-2 border-border bg-muted text-muted-foreground"
            >
              <Briefcase className="size-5" strokeWidth={1.75} />
            </div>
          )}
        </>
      )}

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-display text-base font-semibold text-foreground">
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
          {internship.remotePolicy && <RemoteChip policy={internship.remotePolicy} />}
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
        </div>
      </div>

      {bookmarkSlot && (
        <div className="relative z-10 shrink-0">{bookmarkSlot}</div>
      )}
    </div>
  );
}
