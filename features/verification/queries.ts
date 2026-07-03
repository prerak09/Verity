// features/verification/queries.ts — admin verification queue (FR-50).

import { db } from "@/lib/db";
import type { VerificationQueueItem } from "@/types";

/** All PENDING companies awaiting review, oldest submission first. */
export async function getVerificationQueue(): Promise<VerificationQueueItem[]> {
  const companies = await db.company.findMany({
    where: { verificationStatus: "PENDING", deletedAt: null },
    orderBy: { updatedAt: "asc" },
    select: {
      id: true,
      slug: true,
      name: true,
      logoUrl: true,
      updatedAt: true,
      rejectionReason: true, // prior reason shown on resubmission (PRD §23)
    },
  });
  return companies.map((c) => ({
    companyId: c.id,
    companySlug: c.slug,
    companyName: c.name,
    logoUrl: c.logoUrl,
    submittedAt: c.updatedAt.toISOString(),
    priorRejectionReason: c.rejectionReason,
  }));
}
