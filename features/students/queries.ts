// features/students/queries.ts — student profile reads (PRD §14.1).

import { db } from "@/lib/db";
import type { StudentProfileDTO } from "@/types";

/** The student's profile joined with their User identity fields. */
export async function getStudentProfile(
  userId: string,
): Promise<StudentProfileDTO | null> {
  const user = await db.user.findFirst({
    where: { id: userId, deletedAt: null },
    include: { studentProfile: true },
  });
  if (!user) return null;

  const p = user.studentProfile;
  return {
    id: p?.id ?? "",
    userId: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    college: p?.college ?? null,
    gradYear: p?.gradYear ?? null,
    resumeUrl: p?.resumeUrl ?? null,
    bio: p?.bio ?? null,
  };
}
