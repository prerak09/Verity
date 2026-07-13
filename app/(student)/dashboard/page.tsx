import Link from "next/link";
import {
  Building2,
  Layers,
  Bookmark,
  Send,
  CheckCircle2,
  Briefcase,
  Brain,
  Code2,
  DollarSign,
  HeartPulse,
  ShoppingBag,
  ShieldCheck,
  GraduationCap,
  Truck,
  Car,
  Search as SearchIcon,
} from "lucide-react";

import { DashboardSection } from "@/components/shared/DashboardSection";
import { CompanyCard } from "@/components/shared/CompanyCard";
import { InternshipCard } from "@/components/shared/InternshipCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ProfileCompletionBanner } from "@/components/shared/ProfileCompletionBanner";
import { StatTile } from "@/components/shared/StatTile";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth";
import { listCategories } from "@/features/companies/queries";
import { listApplications } from "@/features/applications/queries";
import {
  getStudentProfile,
  profileCompletenessPercent,
  getDashboardStats,
  getContinueItems,
  type DashboardStats,
} from "@/features/students/queries";
import type {
  ApplicationStatus,
  BookmarkDTO,
  ApplicationDTO,
  TaxonomyRef,
} from "@/types";

const STATUS_ORDER: ApplicationStatus[] = ["SAVED", "APPLIED", "OA", "INTERVIEW", "OFFER"];
const STATUS_LABEL: Record<ApplicationStatus, string> = {
  SAVED: "Saved",
  APPLIED: "Applied",
  OA: "OA",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

const CATEGORY_ICON: Record<string, React.ElementType> = {
  fintech: DollarSign,
  "ai-ml": Brain,
  devtools: Code2,
  healthtech: HeartPulse,
  saas: Layers,
  consumer: ShoppingBag,
  infrastructure: ShieldCheck,
  edtech: GraduationCap,
  logistics: Truck,
  mobility: Car,
};

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const days = Math.floor(ms / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export const dynamic = "force-dynamic";

const EMPTY_STATS: DashboardStats = {
  companiesTracked: { value: 0, deltaWeek: 0 },
  jobsFound: { value: 0, deltaWeek: 0 },
  bookmarks: { value: 0, deltaWeek: 0 },
  applications: { value: 0, inProgress: 0 },
  responses: { value: 0, deltaWeek: 0 },
};

export default async function StudentDashboardPage() {
  let firstName = "there";
  let profilePercent = 100;
  let stats: DashboardStats = EMPTY_STATS;
  let continueItems: BookmarkDTO[] = [];
  let applications: ApplicationDTO[] = [];
  let categories: TaxonomyRef[] = [];

  try {
    const [user, cats] = await Promise.all([getCurrentUser(), listCategories()]);
    categories = cats;

    if (user) {
      firstName = user.name?.split(" ")[0] || "there";
      const [profile, dashboardStats, items, apps] = await Promise.all([
        getStudentProfile(user.id),
        getDashboardStats(user.id),
        getContinueItems(user.id),
        listApplications(user.id),
      ]);
      if (profile) profilePercent = profileCompletenessPercent(profile);
      stats = dashboardStats;
      continueItems = items;
      applications = apps;
    }
  } catch {
    // DB unreachable — sections render their empty states.
  }

  const tracker = STATUS_ORDER.map((status) => ({
    status,
    count: applications.filter((a) => a.status === status).length,
  }));

  const activity = [
    ...continueItems.map((b) => ({
      icon: Bookmark,
      text: `You bookmarked ${b.company?.name ?? b.internship?.title}`,
      at: b.createdAt,
    })),
    ...applications.map((a) => ({
      icon: Briefcase,
      text: `${STATUS_LABEL[a.status]} — ${a.internship.title} at ${a.internship.companyName}`,
      at: a.updatedAt,
    })),
  ]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 6);

  return (
    <div className="mx-auto max-w-wide space-y-8 px-4 py-8 sm:px-6">
      <ProfileCompletionBanner percent={profilePercent} />

      <div>
        <h1 className="font-display text-3xl font-bold text-neutral-950">
          Welcome back, {firstName} 👋
        </h1>
        <p className="mt-1 text-body text-muted-foreground">
          Let&apos;s find your next great opportunity.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatTile
          icon={<Building2 />}
          value={stats.companiesTracked.value.toLocaleString()}
          label="Companies Tracked"
          color="lavender"
          delta={stats.companiesTracked.deltaWeek > 0 ? `↑ ${stats.companiesTracked.deltaWeek} this week` : undefined}
        />
        <StatTile
          icon={<Layers />}
          value={stats.jobsFound.value.toLocaleString()}
          label="Jobs Found"
          color="lime"
          delta={stats.jobsFound.deltaWeek > 0 ? `↑ ${stats.jobsFound.deltaWeek} this week` : undefined}
        />
        <StatTile
          icon={<Bookmark />}
          value={stats.bookmarks.value.toLocaleString()}
          label="Bookmarks"
          color="yellow"
          delta={stats.bookmarks.deltaWeek > 0 ? `↑ ${stats.bookmarks.deltaWeek} this week` : undefined}
        />
        <StatTile
          icon={<Send />}
          value={stats.applications.value.toLocaleString()}
          label="Applications"
          color="lavender"
          delta={stats.applications.inProgress > 0 ? `${stats.applications.inProgress} in progress` : undefined}
        />
        <StatTile
          icon={<CheckCircle2 />}
          value={stats.responses.value.toLocaleString()}
          label="Responses"
          color="mint"
          delta={stats.responses.deltaWeek > 0 ? `↑ ${stats.responses.deltaWeek} this week` : undefined}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardSection title="Continue where you left off" viewAllHref="/bookmarks">
          {continueItems.length === 0 ? (
            <EmptyState
              icon={Bookmark}
              title="Nothing saved yet"
              description="Bookmark a company or internship and it'll show up here."
              action={{ label: "Browse companies", href: "/companies" }}
              compact
            />
          ) : (
            <div className="space-y-3">
              {continueItems.map((b) =>
                b.internship ? (
                  <InternshipCard key={b.id} internship={b.internship} />
                ) : b.company ? (
                  <CompanyCard key={b.id} company={b.company} />
                ) : null,
              )}
            </div>
          )}
        </DashboardSection>

        <DashboardSection title="Recent activity">
          {activity.length === 0 ? (
            <p className="text-body-sm text-muted-foreground">No activity yet.</p>
          ) : (
            <ul className="space-y-3">
              {activity.map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-[3px] border-2 border-neutral-950 bg-card">
                    <item.icon className="size-4 text-neutral-950" strokeWidth={1.75} aria-hidden />
                  </span>
                  <p className="min-w-0 flex-1 text-body-sm text-foreground">{item.text}</p>
                  <span className="shrink-0 text-caption text-muted-foreground">
                    {timeAgo(item.at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </DashboardSection>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardSection title="Browse by category" viewAllHref="/categories">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {categories.map((category) => {
              const Icon = CATEGORY_ICON[category.slug] ?? Layers;
              return (
                <Link
                  key={category.id}
                  href={`/search?category=${category.slug}`}
                  className="retro-card retro-hover flex flex-col items-center gap-2 p-3 text-center"
                >
                  <span className="flex size-9 items-center justify-center rounded-[3px] border-2 border-neutral-950 bg-tile-lavender">
                    <Icon className="size-4.5 text-neutral-950" strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className="text-caption font-medium text-foreground">{category.name}</span>
                </Link>
              );
            })}
          </div>
        </DashboardSection>

        <DashboardSection title="Application tracker" viewAllHref="/applications">
          <div className="space-y-3">
            <div className="grid grid-cols-5 gap-2">
              {tracker.map(({ status, count }) => (
                <Link
                  key={status}
                  href="/applications"
                  className="rounded-lg border-[3px] border-neutral-950 bg-card p-3 text-center shadow-brutal-xs hover:bg-muted"
                >
                  <p className="font-display text-h3 tabular text-foreground">{count}</p>
                  <p className="mt-0.5 text-caption text-muted-foreground">{STATUS_LABEL[status]}</p>
                </Link>
              ))}
            </div>
            <Link
              href="/applications"
              className="flex items-center gap-3 rounded-lg border-2 border-dashed border-neutral-400 p-3 text-body-sm text-muted-foreground hover:border-neutral-950 hover:text-foreground"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-current">
                ★
              </span>
              <span>
                <span className="font-medium text-foreground">Keep tracking to stay organized</span>
                <br />
                Track your applications and never miss an update.
              </span>
            </Link>
          </div>
        </DashboardSection>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 rounded-[4px] border-[3px] border-neutral-950 bg-lime-200 p-6 [box-shadow:4px_4px_0_0_var(--color-neutral-950)] sm:flex-row">
        <div>
          <p className="font-display text-xl font-bold text-neutral-950">
            Find the right opportunities. Apply with confidence.
          </p>
        </div>
        <div className="flex shrink-0 gap-2.5">
          <Button size="lg" render={<Link href="/jobs" />}>
            Explore Jobs <SearchIcon className="size-4" />
          </Button>
          <Button size="lg" variant="outline" className="bg-card" render={<Link href="/companies" />}>
            Browse Startups
          </Button>
        </div>
      </div>
    </div>
  );
}
