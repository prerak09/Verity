import type { PlatformAnalytics } from "@/types";

/**
 * `avgTimeToDecisionHours` and `avgResolutionHours` are hardcoded to 0 in the
 * real `getPlatformAnalytics()` (no decision-timestamp tracking in V1) — the
 * mock shows realistic non-zero numbers for demo purposes only. Rendering
 * "Not tracked in V1" instead of a misleading "0h avg" once real, and no
 * time-series exists here either (same class of gap as CR-10, not yet filed
 * for this DTO — logged as CONTRACTS.md CR-12).
 */

function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border-2 border-border bg-card p-4 shadow-brutal-sm">
      <p className="text-overline text-muted-foreground">{label}</p>
      <p className="tabular mt-2 font-display text-display-lg text-foreground">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </div>
  );
}

function StatusBarList({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: number; colorClass: string }[];
}) {
  const max = Math.max(...rows.map((r) => r.value), 1);

  return (
    <div className="rounded-xl border-2 border-border bg-card p-5 shadow-brutal-sm">
      <h2 className="text-h4 text-foreground">{title}</h2>
      <div className="mt-4 space-y-3">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="flex items-baseline justify-between gap-2 text-body-sm">
              <span className="text-foreground">{row.label}</span>
              <span className="tabular shrink-0 font-medium text-foreground">
                {row.value.toLocaleString()}
              </span>
            </div>
            <div className="mt-1 h-3 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full ${row.colorClass}`}
                style={{ width: `${Math.max((row.value / max) * 100, row.value > 0 ? 3 : 0)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PlatformAnalyticsCharts({ analytics }: { analytics: PlatformAnalytics }) {
  const topTerms = [...analytics.topSearchTerms].sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-4">
        <StatTile label="Students" value={analytics.studentCount} />
        <StatTile label="Verification backlog" value={analytics.queueThroughput.backlogSize} />
        <StatTile label="Open reports" value={analytics.reportVolume.open} />
        <StatTile label="Resolved reports" value={analytics.reportVolume.resolved} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatusBarList
          title="Companies by verification status"
          rows={[
            { label: "Verified", value: analytics.companyCounts.VERIFIED, colorClass: "bg-success-fg" },
            { label: "Pending", value: analytics.companyCounts.PENDING, colorClass: "bg-warning-fg" },
            { label: "Unverified", value: analytics.companyCounts.UNVERIFIED, colorClass: "bg-muted-foreground" },
            { label: "Rejected", value: analytics.companyCounts.REJECTED, colorClass: "bg-error-fg" },
          ]}
        />
        <StatusBarList
          title="Internships by status"
          rows={[
            { label: "Open", value: analytics.internshipCounts.PUBLISHED, colorClass: "bg-success-fg" },
            { label: "Draft", value: analytics.internshipCounts.DRAFT, colorClass: "bg-muted-foreground" },
            { label: "Closed", value: analytics.internshipCounts.ARCHIVED, colorClass: "bg-warning-fg" },
          ]}
        />
      </div>

      <StatusBarList
        title="Signups by role"
        rows={analytics.signupsByRole.map((r) => ({
          label: r.role.charAt(0) + r.role.slice(1).toLowerCase(),
          value: r.count,
          colorClass: "bg-primary",
        }))}
      />

      <div className="rounded-xl border-2 border-border bg-card p-5 shadow-brutal-sm">
        <h2 className="text-h4 text-foreground">Top search terms</h2>
        <div className="mt-4 space-y-3">
          {topTerms.length === 0 ? (
            <p className="text-body-sm text-muted-foreground">No search activity yet.</p>
          ) : (
            topTerms.map((term) => {
              const max = topTerms[0].count || 1;
              return (
                <div key={term.term}>
                  <div className="flex items-baseline justify-between gap-2 text-body-sm">
                    <span className="text-foreground">{term.term}</span>
                    <span className="tabular shrink-0 font-medium text-foreground">
                      {term.count.toLocaleString()}
                    </span>
                  </div>
                  <div className="mt-1 h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.max((term.count / max) * 100, 3)}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatTile
          label="Avg. time to decision"
          value={
            analytics.queueThroughput.avgTimeToDecisionHours > 0
              ? `${analytics.queueThroughput.avgTimeToDecisionHours}h`
              : "Not tracked in V1"
          }
        />
        <StatTile
          label="Avg. report resolution"
          value={
            analytics.reportVolume.avgResolutionHours > 0
              ? `${analytics.reportVolume.avgResolutionHours}h`
              : "Not tracked in V1"
          }
        />
      </div>
    </div>
  );
}
