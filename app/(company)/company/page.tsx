import Link from "next/link";
import { Eye, Bookmark, Briefcase, ArrowRight } from "lucide-react";

import { VerificationBanner } from "@/features/companies/components/VerificationBanner";
import { Button } from "@/components/ui/button";
import {
  MOCK_CURRENT_COMPANY_OWNER,
  MOCK_COMPANY_DETAILS,
  MOCK_COMPANY_ANALYTICS,
  MOCK_INTERNSHIPS,
} from "@/components/lib/mocks";

function KpiCard({
  icon: Icon,
  label,
  value,
  trend,
}: {
  icon: typeof Eye;
  label: string;
  value: number;
  trend?: string;
}) {
  return (
    <div className="rounded-[4px] border-[3px] border-neutral-950 bg-card p-4 shadow-brutal-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" strokeWidth={1.75} aria-hidden />
        <p className="text-overline">{label}</p>
      </div>
      <p className="tabular mt-2 font-display text-display-lg text-foreground">
        {value.toLocaleString()}
      </p>
      {trend && <p className="mt-1 text-caption text-muted-foreground">{trend}</p>}
    </div>
  );
}

export default function CompanyDashboardPage() {
  const membership = MOCK_CURRENT_COMPANY_OWNER.memberships[0];
  const company = MOCK_COMPANY_DETAILS[membership.companySlug];
  const analytics = MOCK_COMPANY_ANALYTICS;

  const companyInternships = MOCK_INTERNSHIPS.filter(
    (i) => i.companyId === company.id,
  );
  const counts = {
    DRAFT: companyInternships.filter((i) => i.status === "DRAFT").length,
    PUBLISHED: companyInternships.filter((i) => i.status === "PUBLISHED").length,
    ARCHIVED: companyInternships.filter((i) => i.status === "ARCHIVED").length,
  };

  return (
    <div className="mx-auto max-w-wide space-y-8 px-4 py-8 sm:px-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-neutral-950">{company.name} Dashboard</h1>
        <p className="mt-1 text-body text-muted-foreground">
          Here&apos;s how your profile is doing.
        </p>
      </div>

      <VerificationBanner status={company.verificationStatus} />

      <section>
        <h2 className="font-display text-xl font-bold text-neutral-950">Analytics</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <KpiCard
            icon={Eye}
            label="Profile views"
            value={analytics.profileViews.total}
            trend={`${analytics.profileViews.last30d} in the last 30 days`}
          />
          <KpiCard
            icon={Bookmark}
            label="Bookmarks"
            value={analytics.bookmarkCount.total}
            trend={`${analytics.bookmarkCount.last30d} in the last 30 days`}
          />
          <KpiCard
            icon={Briefcase}
            label="Internship views"
            value={analytics.perInternshipViews.reduce((sum, i) => sum + i.views, 0)}
            trend="Across all listings"
          />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[4px] border-[3px] border-neutral-950 bg-card p-4 shadow-brutal-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-h4 text-foreground">Profile completeness</h2>
            <Link
              href="/company/profile"
              className="inline-flex items-center gap-1 text-body-sm font-medium text-foreground hover:underline"
            >
              Edit <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full border border-border bg-muted">
            <div
              className="h-full bg-brand-600"
              style={{ width: `${analytics.profileCompleteness}%` }}
            />
          </div>
          <p className="tabular mt-2 text-body-sm text-muted-foreground">
            {analytics.profileCompleteness}% complete
          </p>
        </div>

        <div className="rounded-[4px] border-[3px] border-neutral-950 bg-card p-4 shadow-brutal-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-h4 text-foreground">Internships</h2>
            <Button size="sm" render={<Link href="/company/internships" />}>
              New internship
            </Button>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="tabular font-display font-display text-xl font-bold text-neutral-950">
                {counts.DRAFT}
              </p>
              <p className="text-caption text-muted-foreground">Draft</p>
            </div>
            <div>
              <p className="tabular font-display text-h3 text-success-fg">
                {counts.PUBLISHED}
              </p>
              <p className="text-caption text-muted-foreground">Open</p>
            </div>
            <div>
              <p className="tabular font-display text-h3 text-muted-foreground">
                {counts.ARCHIVED}
              </p>
              <p className="text-caption text-muted-foreground">Closed</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
