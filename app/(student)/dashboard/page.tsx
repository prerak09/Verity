import Link from "next/link";
import { Bookmark, Briefcase } from "lucide-react";

import { DashboardSection } from "@/components/shared/DashboardSection";
import { CompanyCard } from "@/components/shared/CompanyCard";
import { InternshipCard } from "@/components/shared/InternshipCard";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  MOCK_CATEGORIES,
  MOCK_COMPANIES,
  MOCK_COMPANY_DETAILS,
  MOCK_INTERNSHIPS,
  MOCK_BOOKMARKS,
  MOCK_APPLICATIONS,
} from "@/components/lib/mocks";
import type { ApplicationStatus } from "@/types";

const STATUS_ORDER: ApplicationStatus[] = [
  "SAVED",
  "APPLIED",
  "OA",
  "INTERVIEW",
  "OFFER",
];
const STATUS_LABEL: Record<ApplicationStatus, string> = {
  SAVED: "Saved",
  APPLIED: "Applied",
  OA: "OA",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const days = Math.floor(ms / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function HScroll({ children }: { children: React.ReactNode }) {
  return (
    <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2">{children}</div>
  );
}

export default function StudentDashboardPage() {
  // Trending / Recommended don't have dedicated mocks distinct from the
  // catalog (no trending-velocity or recommendation-score field on
  // CompanyDetail) — sliced from the same verified pool with a different
  // order, same way the real rules-based query would narrow it server-side.
  const verified = MOCK_COMPANIES.filter((c) => c.verified);
  const trending = verified.slice(0, 4);
  const recommended = [...verified].reverse().slice(0, 4);

  const recentlyAdded = Object.values(MOCK_COMPANY_DETAILS)
    .filter((c) => c.verified)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 4);

  const latestInternships = MOCK_INTERNSHIPS.filter((i) => i.status === "PUBLISHED")
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""))
    .slice(0, 4);

  const bookmarkPreview = MOCK_BOOKMARKS.slice(0, 4);

  const tracker = STATUS_ORDER.map((status) => ({
    status,
    count: MOCK_APPLICATIONS.filter((a) => a.status === status).length,
  }));

  const activity = [
    ...MOCK_BOOKMARKS.map((b) => ({
      icon: Bookmark,
      text: `Bookmarked ${b.company?.name ?? b.internship?.title}`,
      at: b.createdAt,
    })),
    ...MOCK_APPLICATIONS.map((a) => ({
      icon: Briefcase,
      text: `${STATUS_LABEL[a.status]} — ${a.internship.title}`,
      at: a.updatedAt,
    })),
  ]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-wide space-y-10 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-h1 text-foreground">Dashboard</h1>
        <p className="mt-1 text-body text-muted-foreground">
          Welcome back — here&apos;s what&apos;s new.
        </p>
      </div>

      <DashboardSection title="Categories" viewAllHref="/categories">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {MOCK_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/search?category=${category.slug}`}
              className="shrink-0 rounded-sm border-2 border-border bg-muted px-3 py-1.5 text-body-sm font-medium text-foreground hover:border-brand-600"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </DashboardSection>

      <DashboardSection title="Trending companies" viewAllHref="/search?sort=trending">
        <HScroll>
          {trending.map((company) => (
            <CompanyCard key={company.id} company={company} className="w-80 shrink-0" />
          ))}
        </HScroll>
      </DashboardSection>

      <DashboardSection title="Recommended for you" viewAllHref="/search">
        <HScroll>
          {recommended.map((company) => (
            <CompanyCard key={company.id} company={company} className="w-80 shrink-0" />
          ))}
        </HScroll>
      </DashboardSection>

      <DashboardSection title="Recently added" viewAllHref="/search?sort=recent">
        <HScroll>
          {recentlyAdded.map((company) => (
            <CompanyCard
              key={company.id}
              company={{
                id: company.id,
                slug: company.slug,
                name: company.name,
                tagline: company.tagline,
                logoUrl: company.logoUrl,
                fundingStage: company.fundingStage,
                remotePolicy: company.remotePolicy,
                verified: company.verified,
                categories: company.categories,
                openInternshipCount: company.openInternships.length,
              }}
              className="w-80 shrink-0"
            />
          ))}
        </HScroll>
      </DashboardSection>

      <DashboardSection title="Latest internships" viewAllHref="/internships">
        <HScroll>
          {latestInternships.map((internship) => (
            <InternshipCard
              key={internship.id}
              internship={internship}
              className="w-80 shrink-0"
            />
          ))}
        </HScroll>
      </DashboardSection>

      <DashboardSection title="Bookmarks" viewAllHref="/bookmarks">
        {bookmarkPreview.length === 0 ? (
          <EmptyState
            icon={Bookmark}
            title="Nothing saved yet"
            description="Save companies worth remembering — they'll show up here."
            action={{ label: "Browse companies", href: "/companies" }}
            compact
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {bookmarkPreview.map((bookmark) =>
              bookmark.company ? (
                <CompanyCard key={bookmark.id} company={bookmark.company} />
              ) : bookmark.internship ? (
                <InternshipCard key={bookmark.id} internship={bookmark.internship} />
              ) : null,
            )}
          </div>
        )}
      </DashboardSection>

      <DashboardSection title="Application tracker" viewAllHref="/applications">
        <div className="grid grid-cols-5 gap-2">
          {tracker.map(({ status, count }) => (
            <Link
              key={status}
              href="/applications"
              className="rounded-lg border-2 border-border bg-card p-3 text-center shadow-brutal-xs hover:bg-muted"
            >
              <p className="font-display text-h3 tabular text-foreground">{count}</p>
              <p className="mt-0.5 text-caption text-muted-foreground">
                {STATUS_LABEL[status]}
              </p>
            </Link>
          ))}
        </div>
      </DashboardSection>

      <DashboardSection title="Recent activity">
        {activity.length === 0 ? (
          <p className="text-body-sm text-muted-foreground">No activity yet.</p>
        ) : (
          <ul className="space-y-3">
            {activity.map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <item.icon className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} aria-hidden />
                <p className="text-body-sm text-foreground">{item.text}</p>
                <span className="text-caption text-muted-foreground">
                  {timeAgo(item.at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </DashboardSection>
    </div>
  );
}
