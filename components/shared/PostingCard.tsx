import Link from "next/link";
import { MapPin } from "lucide-react";

import type { PostingOfTheDay } from "@/types";
import { CompanyLogo } from "@/components/shared/CompanyLogo";
import { VerifiedBadge } from "@/components/shared/VerifiedBadge";
import { RemoteChip } from "@/components/shared/RemoteChip";
import { SignInGate } from "@/components/shared/SignInGate";
import { BookmarkButton } from "@/features/bookmarks/components/BookmarkButton";

const DAY_MS = 24 * 60 * 60 * 1000;

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const days = Math.floor(ms / DAY_MS);
  if (days <= 0) return "Posted today";
  if (days === 1) return "Posted yesterday";
  if (days < 30) return `Posted ${days}d ago`;
  return `Posted ${Math.floor(days / 30)}mo ago`;
}

// Hostname substring -> display label, checked against every applyUrl host
// actually present in the seeded data (Greenhouse, Ashby, Lever, Workday,
// Personio, SmartRecruiters, LinkedIn, Oracle Cloud, Y Combinator/personal
// sites, plus each company's own careers.* domain).
const PLATFORM_HOSTS: [string, string][] = [
  ["greenhouse", "Greenhouse"],
  ["ashbyhq", "Ashby"],
  ["lever", "Lever"],
  ["myworkdayjobs", "Workday"],
  ["personio", "Personio"],
  ["smartrecruiters", "SmartRecruiters"],
  ["linkedin", "LinkedIn"],
  ["oraclecloud", "Oracle Cloud"],
  ["workatastartup", "Y Combinator"],
];

/** Single honest apply-channel label derived from the real applyUrl — never
 *  a fabricated multi-provider list, since we only store one URL per role. */
function applyPlatformLabel(applyUrl: string, companyName: string): string {
  let host = "";
  try {
    host = new URL(applyUrl).hostname.toLowerCase();
  } catch {
    return `${companyName} Careers`;
  }
  for (const [needle, label] of PLATFORM_HOSTS) {
    if (host.includes(needle)) return label;
  }
  return `${companyName} Careers`;
}

function Badge({
  color,
  children,
}: {
  color: "mint" | "pink";
  children: React.ReactNode;
}) {
  return (
    <span
      className={
        "inline-flex items-center rounded-sm border-2 border-neutral-950 px-2 py-0.5 text-[0.6875rem] font-bold uppercase tracking-[0.04em] text-neutral-950 " +
        (color === "mint" ? "bg-tile-mint" : "bg-tile-pink")
      }
    >
      {children}
    </span>
  );
}

export function PostingCard({ posting }: { posting: PostingOfTheDay }) {
  const ageMs = Date.now() - new Date(posting.createdAt).getTime();
  const isNewToday = ageMs < DAY_MS;
  const isNewThisWeek = !isNewToday && ageMs < 7 * DAY_MS;
  const trending = posting.bookmarkCount >= 3;

  return (
    <div className="retro-card retro-hover relative flex w-72 shrink-0 snap-start flex-col gap-3 p-4">
      <SignInGate
        redirectUrl={`/internships/${posting.slug}`}
        trigger={
          <span
            role="link"
            aria-label={`View ${posting.title} at ${posting.companyName}`}
            className="absolute inset-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        }
      >
        <Link
          href={`/internships/${posting.slug}`}
          className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span className="sr-only">View {posting.title} at {posting.companyName}</span>
        </Link>
      </SignInGate>

      <div className="flex items-center gap-2.5">
        <CompanyLogo
          src={posting.companyLogoUrl}
          name={posting.companyName}
          seed={posting.companySlug}
          size={40}
        />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="truncate font-display text-sm font-bold text-neutral-950">
              {posting.companyName}
            </span>
            <VerifiedBadge size="sm" />
          </div>
          <p className="truncate text-body-sm text-muted-foreground">{posting.title}</p>
        </div>
      </div>

      {posting.location && (
        <p className="flex items-center gap-1 text-caption text-muted-foreground">
          <MapPin className="size-3.5 shrink-0" aria-hidden />
          <span className="truncate">{posting.location}</span>
        </p>
      )}

      <div className="flex flex-wrap items-center gap-1.5">
        {posting.remotePolicy && <RemoteChip policy={posting.remotePolicy} />}
        {isNewToday && <Badge color="mint">New Today</Badge>}
        {isNewThisWeek && <Badge color="mint">New This Week</Badge>}
        {trending && <Badge color="pink">Trending</Badge>}
      </div>

      <div className="mt-auto flex items-end justify-between gap-2 border-t-2 border-border pt-3">
        <div className="min-w-0">
          <p className="text-[0.625rem] font-semibold uppercase tracking-[0.04em] text-muted-foreground">
            Apply via
          </p>
          <p className="truncate text-caption font-medium text-foreground">
            {applyPlatformLabel(posting.applyUrl, posting.companyName)}
          </p>
          <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
            {timeAgo(posting.createdAt)}
          </p>
        </div>
        <div className="relative z-10 shrink-0">
          <BookmarkButton
            targetType="INTERNSHIP"
            targetId={posting.id}
            initialBookmarked={false}
          />
        </div>
      </div>
    </div>
  );
}
