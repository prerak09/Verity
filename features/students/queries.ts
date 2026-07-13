// features/students/queries.ts — student profile reads (PRD §14.1).

import { db } from "@/lib/db";
import { listBookmarks } from "@/features/bookmarks/queries";
import type { BookmarkDTO, StudentProfileDTO } from "@/types";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export interface DashboardStats {
  companiesTracked: { value: number; deltaWeek: number };
  jobsFound: { value: number; deltaWeek: number };
  bookmarks: { value: number; deltaWeek: number };
  applications: { value: number; inProgress: number };
  responses: { value: number; deltaWeek: number };
}

/** Top stat row on the student dashboard — real counts, real 7-day deltas. */
export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const weekAgo = new Date(Date.now() - WEEK_MS);
  const RESPONSE_STATUSES = ["OA", "INTERVIEW", "OFFER", "REJECTED"] as const;
  const IN_PROGRESS_STATUSES = ["APPLIED", "OA", "INTERVIEW"] as const;

  const [
    companiesTotal,
    companiesNew,
    jobsTotal,
    jobsNew,
    bookmarksTotal,
    bookmarksNew,
    applicationsTotal,
    applicationsInProgress,
    responsesTotal,
    responsesNew,
  ] = await Promise.all([
    db.company.count({ where: { verificationStatus: "VERIFIED", deletedAt: null } }),
    db.company.count({
      where: { verificationStatus: "VERIFIED", deletedAt: null, createdAt: { gte: weekAgo } },
    }),
    db.internship.count({ where: { status: "PUBLISHED", deletedAt: null } }),
    db.internship.count({
      where: { status: "PUBLISHED", deletedAt: null, createdAt: { gte: weekAgo } },
    }),
    db.bookmark.count({ where: { userId } }),
    db.bookmark.count({ where: { userId, createdAt: { gte: weekAgo } } }),
    db.application.count({ where: { userId } }),
    db.application.count({ where: { userId, status: { in: [...IN_PROGRESS_STATUSES] } } }),
    db.application.count({ where: { userId, status: { in: [...RESPONSE_STATUSES] } } }),
    db.application.count({
      where: { userId, status: { in: [...RESPONSE_STATUSES] }, updatedAt: { gte: weekAgo } },
    }),
  ]);

  return {
    companiesTracked: { value: companiesTotal, deltaWeek: companiesNew },
    jobsFound: { value: jobsTotal, deltaWeek: jobsNew },
    bookmarks: { value: bookmarksTotal, deltaWeek: bookmarksNew },
    applications: { value: applicationsTotal, inProgress: applicationsInProgress },
    responses: { value: responsesTotal, deltaWeek: responsesNew },
  };
}

/**
 * "Continue where you left off" — no page-view tracking exists in this app,
 * so this reuses the student's most recent bookmarks (newest first) as an
 * honest proxy for "what they were just looking at". Internship bookmarks
 * are prioritized since they're the more actionable next step.
 */
export async function getContinueItems(userId: string, limit = 3): Promise<BookmarkDTO[]> {
  const bookmarks = await listBookmarks(userId);
  const internshipBookmarks = bookmarks.filter((b) => b.internship);
  const companyBookmarks = bookmarks.filter((b) => !b.internship && b.company);
  return [...internshipBookmarks, ...companyBookmarks].slice(0, limit);
}

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
