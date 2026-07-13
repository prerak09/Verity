import Link from "next/link";
import { Bookmark, Briefcase } from "lucide-react";

import { DashboardSection } from "@/components/shared/DashboardSection";
import { CompanyCard } from "@/components/shared/CompanyCard";
import { InternshipCard } from "@/components/shared/InternshipCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProfileCompletionBanner } from "@/components/shared/ProfileCompletionBanner";
import { getCurrentUser } from "@/lib/auth";
import { listCompanies, getOpenInternships, listCategories } from "@/features/companies/queries";
import { listInternships } from "@/features/internships/queries";
import { getTrendingCompanies } from "@/features/trending/queries";
import { getRecommendedCompanies } from "@/features/students/recommendations";
import { listBookmarks } from "@/features/bookmarks/queries";
import { listApplications } from "@/features/applications/queries";
import { getStudentProfile, profileCompletenessPercent } from "@/features/students/queries";
import type {
  ApplicationStatus,
  CompanyCard as CompanyCardDTO,
  InternshipCard as InternshipCardDTO,
  BookmarkDTO,
  ApplicationDTO,
  TaxonomyRef,
} from "@/types";

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

export const dynamic = "force-dynamic";

export default async function StudentDashboardPage() {
  let trending: CompanyCardDTO[] = [];
  let recommended: CompanyCardDTO[] = [];
  let recentlyAdded: CompanyCardDTO[] = [];
  let latestInternships: InternshipCardDTO[] = [];
  let bookmarkPreview: BookmarkDTO[] = [];
  let applications: ApplicationDTO[] = [];
  let categories: TaxonomyRef[] = [];
  let profilePercent = 100;

  try {
    const user = await getCurrentUser();
    const [trend, recent, latest, cats] = await Promise.all([
      getTrendingCompanies(4),
      listCompanies({ page: 1, pageSize: 4, sort: "recent" }),
      listInternships({ page: 1, pageSize: 4, sort: "recent" }),
      listCategories(),
    ]);
    trending = trend;
    recentlyAdded = recent.data;
    latestInternships = latest.data;
    categories = cats;

    if (user) {
      const [recs, bms, apps, profile] = await Promise.all([
        getRecommendedCompanies(user.id),
        listBookmarks(user.id),
        listApplications(user.id),
        getStudentProfile(user.id),
      ]);
      recommended = recs.slice(0, 4);
      bookmarkPreview = bms.slice(0, 4);
      applications = apps;
      if (profile) profilePercent = profileCompletenessPercent(profile);
    }
  } catch {
    // DB unreachable — sections render their empty states.
  }

  // Fall back to trending for recommended when the user has no signal yet.
  if (recommended.length === 0) recommended = trending;

  void getOpenInternships; // reserved for a future per-company dashboard widget

  const tracker = STATUS_ORDER.map((status) => ({
    status,
    count: applications.filter((a) => a.status === status).length,
  }));

  const activity = [
    ...bookmarkPreview.map((b) => ({
      icon: Bookmark,
      text: `Bookmarked ${b.company?.name ?? b.internship?.title}`,
      at: b.createdAt,
    })),
    ...applications.map((a) => ({
      icon: Briefcase,
      text: `${STATUS_LABEL[a.status]} — ${a.internship.title}`,
      at: a.updatedAt,
    })),
  ]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-wide space-y-10 px-4 py-8 sm:px-6">
      <ProfileCompletionBanner percent={profilePercent} />
      <div>
        <h1 className="font-display text-3xl font-bold text-neutral-950">Dashboard</h1>
        <p className="mt-1 text-body text-muted-foreground">
          Welcome back — here&apos;s what&apos;s new.
        </p>
      </div>

      {categories.length > 0 && (
        <DashboardSection title="Categories" viewAllHref="/categories">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/search?category=${category.slug}`}
                className="shrink-0 rounded-sm border-[3px] border-neutral-950 bg-muted px-3 py-1.5 text-body-sm font-medium text-foreground hover:border-brand-600"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </DashboardSection>
      )}

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
              company={company}
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
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {tracker.map(({ status, count }) => (
            <Link
              key={status}
              href="/applications"
              className="rounded-lg border-[3px] border-neutral-950 bg-card p-3 text-center shadow-brutal-xs hover:bg-muted"
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
