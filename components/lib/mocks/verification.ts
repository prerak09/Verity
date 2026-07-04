import type { ReportDTO, VerificationQueueItem } from "@/types";

const now = Date.now();
const daysAgo = (n: number) => new Date(now - n * 86_400_000).toISOString();

export const MOCK_VERIFICATION_QUEUE: VerificationQueueItem[] = [
  {
    companyId: "co_meridian",
    companySlug: "meridian-health",
    companyName: "Meridian Health",
    logoUrl: null,
    submittedAt: daysAgo(6),
    priorRejectionReason: null,
  },
  {
    companyId: "co_haven",
    companySlug: "haven-consumer",
    companyName: "Haven",
    logoUrl: null,
    submittedAt: daysAgo(2),
    priorRejectionReason:
      "Domain on file (haven.example.com) doesn't match the email used to sign up. Resubmit with a matching work email.",
  },
  {
    companyId: "co_driftline",
    companySlug: "driftline",
    companyName: "Driftline",
    logoUrl: null,
    submittedAt: daysAgo(1),
    priorRejectionReason: null,
  },
];

export const MOCK_REPORTS: ReportDTO[] = [
  {
    id: "rpt_1",
    reason: "This internship listing links to a closed application form.",
    status: "OPEN",
    reportedByEmail: "student1@example.edu",
    targetCompany: { id: "co_cargobyte", slug: "cargobyte", name: "Cargobyte" },
    createdAt: daysAgo(3),
    resolvedAt: null,
  },
  {
    id: "rpt_2",
    reason: "Company profile claims Series B but their site says Series A.",
    status: "OPEN",
    reportedByEmail: "student2@example.edu",
    targetCompany: { id: "co_fernbank", slug: "fernbank-robotics", name: "Fernbank Robotics" },
    createdAt: daysAgo(8),
    resolvedAt: null,
  },
  {
    id: "rpt_3",
    reason: "Duplicate of an existing company profile.",
    status: "RESOLVED",
    reportedByEmail: "student3@example.edu",
    targetCompany: { id: "co_haven", slug: "haven-consumer", name: "Haven" },
    createdAt: daysAgo(20),
    resolvedAt: daysAgo(18),
  },
];
