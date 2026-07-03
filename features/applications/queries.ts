// features/applications/queries.ts — application tracker reads (FR-42/43).
//
// PRIVACY (FR-44, NFR §13.6): the Application table — status AND notes — is
// student-private. Every query here is scoped by userId, and NO company- or
// admin-facing query in the codebase reads this table. Do not add one.

import { db } from "@/lib/db";
import { toInternshipCard } from "@/features/internships/map";
import type { ApplicationDTO } from "@/types";

/** All tracker entries for a student, newest activity first. */
export async function listApplications(userId: string): Promise<ApplicationDTO[]> {
  const rows = await db.application.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      internship: {
        include: {
          company: { select: { id: true, slug: true, name: true, logoUrl: true } },
        },
      },
    },
  });

  return rows.map((a) => ({
    id: a.id,
    internship: toInternshipCard(a.internship, a.internship.company),
    status: a.status,
    notes: a.notes, // private to this student
    appliedAt: a.appliedAt ? a.appliedAt.toISOString() : null,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  }));
}
