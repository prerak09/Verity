import type { CompanyAnalytics, PlatformAnalytics } from "@/types";

export const MOCK_COMPANY_ANALYTICS: CompanyAnalytics = {
  profileViews: { total: 4820, last30d: 612, last90d: 1740 },
  bookmarkCount: { total: 96, last30d: 14 },
  perInternshipViews: [
    { internshipId: "int_ledgerly_1", title: "Backend Engineering Intern", views: 340 },
    { internshipId: "int_ledgerly_2", title: "Data Engineering Intern", views: 118 },
    { internshipId: "int_ledgerly_3", title: "Product Design Intern", views: 42 },
  ],
  profileCompleteness: 82,
};

export const MOCK_PLATFORM_ANALYTICS: PlatformAnalytics = {
  studentCount: 8420,
  companyCounts: {
    UNVERIFIED: 34,
    PENDING: 12,
    VERIFIED: 214,
    REJECTED: 9,
  },
  internshipCounts: {
    DRAFT: 41,
    PUBLISHED: 356,
    ARCHIVED: 128,
  },
  signupsByRole: [
    { role: "STUDENT", count: 8420 },
    { role: "COMPANY", count: 269 },
    { role: "ADMIN", count: 6 },
  ],
  queueThroughput: { avgTimeToDecisionHours: 19.5, backlogSize: 12 },
  topSearchTerms: [
    { term: "fintech", count: 842 },
    { term: "remote", count: 611 },
    { term: "ai", count: 588 },
    { term: "no experience", count: 340 },
    { term: "healthtech", count: 212 },
  ],
  reportVolume: { open: 2, resolved: 18, avgResolutionHours: 30.2 },
};
