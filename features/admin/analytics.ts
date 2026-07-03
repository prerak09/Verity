// features/admin/analytics.ts — platform-wide analytics (FR-72, PRD §19.2).

import { db } from "@/lib/db";
import type {
  PlatformAnalytics,
  VerificationStatus,
  InternshipStatus,
  PlatformRole,
} from "@/types";

const VERIFICATION_STATUSES: VerificationStatus[] = ["UNVERIFIED", "PENDING", "VERIFIED", "REJECTED"];
const INTERNSHIP_STATUSES: InternshipStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];
const ROLES: PlatformRole[] = ["STUDENT", "COMPANY", "ADMIN"];

export async function getPlatformAnalytics(): Promise<PlatformAnalytics> {
  const [
    studentCount,
    companyByStatus,
    internshipByStatus,
    usersByRole,
    pendingBacklog,
    topTerms,
    openReports,
    resolvedReports,
  ] = await Promise.all([
    db.user.count({ where: { role: "STUDENT", deletedAt: null } }),
    db.company.groupBy({ by: ["verificationStatus"], where: { deletedAt: null }, _count: { _all: true } }),
    db.internship.groupBy({ by: ["status"], where: { deletedAt: null }, _count: { _all: true } }),
    db.user.groupBy({ by: ["role"], where: { deletedAt: null }, _count: { _all: true } }),
    db.company.count({ where: { verificationStatus: "PENDING", deletedAt: null } }),
    db.searchQueryLog.groupBy({
      by: ["term"],
      _count: { _all: true },
      orderBy: { _count: { term: "desc" } },
      take: 10,
    }),
    db.report.count({ where: { status: "OPEN" } }),
    db.report.count({ where: { status: { in: ["RESOLVED", "DISMISSED"] } } }),
  ]);

  const companyCounts = Object.fromEntries(
    VERIFICATION_STATUSES.map((s) => [s, 0]),
  ) as Record<VerificationStatus, number>;
  for (const row of companyByStatus) companyCounts[row.verificationStatus] = row._count._all;

  const internshipCounts = Object.fromEntries(
    INTERNSHIP_STATUSES.map((s) => [s, 0]),
  ) as Record<InternshipStatus, number>;
  for (const row of internshipByStatus) internshipCounts[row.status] = row._count._all;

  const signupsByRole = ROLES.map((role) => ({
    role,
    count: usersByRole.find((r) => r.role === role)?._count._all ?? 0,
  }));

  return {
    studentCount,
    companyCounts,
    internshipCounts,
    signupsByRole,
    queueThroughput: {
      // avg time-to-decision requires decision timestamps we don't store in V1;
      // report backlog size + a placeholder avg keeps the DTO shape stable.
      avgTimeToDecisionHours: 0,
      backlogSize: pendingBacklog,
    },
    topSearchTerms: topTerms.map((t) => ({ term: t.term, count: t._count._all })),
    reportVolume: {
      open: openReports,
      resolved: resolvedReports,
      avgResolutionHours: 0,
    },
  };
}
