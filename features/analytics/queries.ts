// features/analytics/queries.ts — aggregate analytics (PRD §19, NFR §13.6).
//
// PRIVACY: company-facing analytics are AGGREGATE + ANONYMOUS only. We count
// AnalyticsEvent / Bookmark rows; we never return userId or any per-student data,
// and never touch the Application (tracker) table.

import { db } from "@/lib/db";
import { getProfileCompleteness } from "@/features/companies/queries";
import type { CompanyAnalytics } from "@/types";

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

/** Company-facing analytics for a single company (owner/recruiter view). */
export async function getCompanyAnalytics(companyId: string): Promise<CompanyAnalytics> {
  const [
    viewsTotal,
    views30,
    views90,
    bookmarksTotal,
    bookmarks30,
    internships,
    completeness,
  ] = await Promise.all([
    db.analyticsEvent.count({ where: { type: "COMPANY_VIEW", companyId } }),
    db.analyticsEvent.count({ where: { type: "COMPANY_VIEW", companyId, createdAt: { gte: daysAgo(30) } } }),
    db.analyticsEvent.count({ where: { type: "COMPANY_VIEW", companyId, createdAt: { gte: daysAgo(90) } } }),
    db.bookmark.count({ where: { targetType: "COMPANY", companyId } }),
    db.bookmark.count({ where: { targetType: "COMPANY", companyId, createdAt: { gte: daysAgo(30) } } }),
    db.internship.findMany({
      where: { companyId, deletedAt: null },
      select: { id: true, title: true },
    }),
    getProfileCompleteness(companyId),
  ]);

  // Per-internship view counts (aggregate).
  const perInternshipViews = await Promise.all(
    internships.map(async (i) => ({
      internshipId: i.id,
      title: i.title,
      views: await db.analyticsEvent.count({
        where: { type: "INTERNSHIP_VIEW", internshipId: i.id },
      }),
    })),
  );

  return {
    profileViews: { total: viewsTotal, last30d: views30, last90d: views90 },
    bookmarkCount: { total: bookmarksTotal, last30d: bookmarks30 },
    perInternshipViews,
    profileCompleteness: completeness.score,
  };
}
