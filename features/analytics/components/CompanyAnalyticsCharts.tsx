import type { CompanyAnalytics } from "@/types";

/**
 * `CompanyAnalytics` only has cumulative snapshots (total/last30d/last90d),
 * not a real daily time series — so "profile views over time" (PRD §14.2)
 * renders as a two-period comparison (last 30 days vs. the 60 days before
 * that) rather than a fabricated daily trend line. Requested a real
 * time-series field via CONTRACTS.md CR-10.
 */

function BarList({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: number }[];
}) {
  const max = Math.max(...rows.map((r) => r.value), 1);

  return (
    <div className="rounded-xl border-2 border-border bg-card p-5 shadow-brutal-sm">
      <h2 className="text-h4 text-foreground">{title}</h2>
      <div className="mt-4 space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="group">
            <div className="flex items-baseline justify-between gap-2 text-body-sm">
              <span className="truncate text-foreground">{row.label}</span>
              <span className="tabular shrink-0 font-medium text-foreground">
                {row.value.toLocaleString()}
              </span>
            </div>
            <div className="mt-1 h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width] group-hover:opacity-80"
                style={{ width: `${Math.max((row.value / max) * 100, row.value > 0 ? 3 : 0)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CompanyAnalyticsCharts({ analytics }: { analytics: CompanyAnalytics }) {
  const priorProfileViews = Math.max(analytics.profileViews.last90d - analytics.profileViews.last30d, 0);
  const priorBookmarks = Math.max(analytics.bookmarkCount.total - analytics.bookmarkCount.last30d, 0);

  const internshipRows = [...analytics.perInternshipViews]
    .sort((a, b) => b.views - a.views)
    .map((i) => ({ label: i.title, value: i.views }));

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <BarList
        title="Profile views"
        rows={[
          { label: "Last 30 days", value: analytics.profileViews.last30d },
          { label: "Previous 60 days", value: priorProfileViews },
        ]}
      />
      <BarList
        title="Bookmarks"
        rows={[
          { label: "Last 30 days", value: analytics.bookmarkCount.last30d },
          { label: "Before that", value: priorBookmarks },
        ]}
      />
      <div className="sm:col-span-2">
        <BarList title="Views per internship" rows={internshipRows} />
      </div>
    </div>
  );
}
