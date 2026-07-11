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
  const checks = [
    !!p.name,
    !!p.headline,
    !!p.location,
    !!p.college,
    !!p.degree,
    !!p.major,
    p.gradYear != null,
    p.skills.length > 0,
    p.interests.length > 0,
    !!p.linkedinUrl,
    !!p.resumeUrl,
    !!p.bio,
  ];
  const filled = checks.filter(Boolean).length;
  return Math.round((filled / checks.length) * 100);
}
