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
    headline: p?.headline ?? null,
    location: p?.location ?? null,
    college: p?.college ?? null,
    degree: p?.degree ?? null,
    major: p?.major ?? null,
    gradYear: p?.gradYear ?? null,
    skills: p?.skills ?? [],
    interests: p?.interests ?? [],
    linkedinUrl: p?.linkedinUrl ?? null,
    githubUrl: p?.githubUrl ?? null,
    portfolioUrl: p?.portfolioUrl ?? null,
    resumeUrl: p?.resumeUrl ?? null,
    bio: p?.bio ?? null,
  };
}

/** 0–100 completeness across the key profile fields (for the dashboard meter). */
export function profileCompletenessPercent(p: StudentProfileDTO): number {
  // Weighted so the fields companies actually filter/screen on (identity,
  // education, skills, resume) count more than nice-to-haves like a portfolio
  // link (audit ISSUE-040). Weights sum to 100.
  const weighted: [boolean, number][] = [
    [!!p.name, 12],
    [!!p.headline, 8],
    [!!p.location, 6],
    [!!p.college, 12],
    [!!p.degree, 6],
    [!!p.major, 8],
    [p.gradYear != null, 8],
    [p.skills.length > 0, 14],
    [p.interests.length > 0, 6],
    [!!p.resumeUrl, 12],
    [!!p.linkedinUrl, 4],
    [!!p.bio, 4],
  ];
  const total = weighted.reduce((sum, [, w]) => sum + w, 0);
  const earned = weighted.reduce((sum, [ok, w]) => sum + (ok ? w : 0), 0);
  return Math.round((earned / total) * 100);
}
