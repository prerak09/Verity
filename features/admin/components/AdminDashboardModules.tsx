import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

import type { PlatformAnalytics, ReportDTO, VerificationQueueItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function ModuleCard({
  title,
  count,
  href,
  linkLabel = "View all",
  children,
}: {
  title: string;
  count?: number;
  href: string;
  linkLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[4px] border-[3px] border-neutral-950 bg-card p-5 shadow-brutal-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-h4 text-foreground">{title}</h2>
          {count !== undefined && <Badge>{count}</Badge>}
        </div>
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-body-sm font-medium text-foreground hover:underline"
        >
          {linkLabel} <ArrowRight className="size-3.5" aria-hidden />
        </Link>
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[4px] border-[3px] border-neutral-950 bg-card p-4 shadow-brutal-sm">
      <p className="text-overline text-muted-foreground">{label}</p>
      <p className="tabular mt-2 font-display text-display-lg text-foreground">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

export function AdminDashboardModules({
  verificationQueue,
  reports,
  analytics,
  categoryCount,
  technologyCount,
  featuredCount,
}: {
  verificationQueue: VerificationQueueItem[];
  reports: ReportDTO[];
  analytics: PlatformAnalytics;
  categoryCount: number;
  technologyCount: number;
  featuredCount: number;
}) {
  const openReports = reports.filter((r) => r.status === "OPEN");

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-4">
        <StatTile label="Students" value={analytics.studentCount} />
        <StatTile label="Verified companies" value={analytics.companyCounts.VERIFIED} />
        <StatTile label="Open internships" value={analytics.internshipCounts.PUBLISHED} />
        <StatTile label="Open reports" value={analytics.reportVolume.open} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ModuleCard title="Verification Queue" count={verificationQueue.length} href="/admin/verification">
          {verificationQueue.length === 0 ? (
            <p className="text-body-sm text-muted-foreground">Nothing pending.</p>
          ) : (
            <ul className="space-y-2">
              {verificationQueue.slice(0, 5).map((item) => (
                <li key={item.companyId} className="flex items-center justify-between text-body-sm">
                  <span className="text-foreground">{item.companyName}</span>
                  <span className="text-caption text-muted-foreground">
                    {new Date(item.submittedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </ModuleCard>

        <ModuleCard title="Reports" count={openReports.length} href="/admin/reports">
          {openReports.length === 0 ? (
            <p className="text-body-sm text-muted-foreground">No open reports.</p>
          ) : (
            <ul className="space-y-2">
              {openReports.slice(0, 5).map((report) => (
                <li key={report.id} className="text-body-sm">
                  <span className="text-foreground">{report.targetCompany?.name ?? "Unknown"}</span>
                  <span className="text-muted-foreground"> — {report.reason}</span>
                </li>
              ))}
            </ul>
          )}
        </ModuleCard>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ModuleCard title="Users" href="/admin/users" linkLabel="Manage">
          <form action="/admin/users" className="flex flex-col gap-2 sm:flex-row">
            <Input name="q" placeholder="Search by name or email…" />
            <Button type="submit" size="sm" variant="outline">
              Search
            </Button>
          </form>
        </ModuleCard>

        <ModuleCard title="Companies" href="/admin/companies" linkLabel="Manage">
          <div className="flex flex-col gap-2 sm:flex-row">
            <form action="/admin/companies" className="flex flex-1 gap-2">
              <Input name="q" placeholder="Search companies…" />
              <Button type="submit" size="sm" variant="outline">
                Search
              </Button>
            </form>
            <Button size="sm" render={<Link href="/admin/companies?new=1" />}>
              <Plus className="size-4" aria-hidden />
              New
            </Button>
          </div>
        </ModuleCard>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ModuleCard title="Categories / Technologies" href="/admin/taxonomy" linkLabel="Manage">
          <p className="text-body-sm text-muted-foreground">
            {categoryCount} categories · {technologyCount} technologies
          </p>
        </ModuleCard>

        <ModuleCard title="Featured" count={featuredCount} href="/admin/featured" linkLabel="Manage">
          <p className="text-body-sm text-muted-foreground">
            {featuredCount} {featuredCount === 1 ? "company" : "companies"} currently featured.
          </p>
        </ModuleCard>
      </div>
    </div>
  );
}
