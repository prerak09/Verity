// features/students/recommendations.ts — rules-based recommended companies (PRD §14.1).
//
// V1 has no ML: we recommend by OVERLAP of category/technology between (a)
// the companies a student already bookmarked and (b) the skills/interests on
// their StudentProfile, matched case-insensitively against Technology.name
// and Category.name (the profile form's tag suggestions are drawn from this
// same taxonomy — see SKILL_SUGGESTIONS/INTEREST_SUGGESTIONS in
// features/students/components/ProfileForm.tsx). Falls back to featured
// companies for a cold-start (no bookmarks and no profile signals yet).

import { db } from "@/lib/db";
import type { CompanyCard } from "@/types";

const LIMIT = 8;

function toCard(c: {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  logoUrl: string | null;
  fundingStage: CompanyCard["fundingStage"];
  remotePolicy: CompanyCard["remotePolicy"];
  verificationStatus: string;
  categories: { category: { id: string; slug: string; name: string } }[];
  _count: { internships: number };
}): CompanyCard {
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    tagline: c.tagline,
    logoUrl: c.logoUrl,
    fundingStage: c.fundingStage,
    remotePolicy: c.remotePolicy,
    verified: c.verificationStatus === "VERIFIED",
    categories: c.categories.map((cc) => ({
      id: cc.category.id,
      slug: cc.category.slug,
      name: cc.category.name,
    })),
    openInternshipCount: c._count.internships,
  };
}

const cardInclude = {
  categories: { include: { category: true } },
  _count: {
    select: { internships: { where: { status: "PUBLISHED", deletedAt: null } } },
  },
} as const;

export async function getRecommendedCompanies(userId: string): Promise<CompanyCard[]> {
  // 1a. Categories/technologies the student has signalled interest in via bookmarks.
  const bookmarked = await db.bookmark.findMany({
    where: { userId, targetType: "COMPANY", companyId: { not: null } },
    select: { companyId: true },
  });
  const bookmarkedIds = bookmarked
    .map((b) => b.companyId)
    .filter((id): id is string => !!id);

  const categoryIds = new Set<string>();
  const technologyIds = new Set<string>();

  if (bookmarkedIds.length > 0) {
    const signals = await db.company.findMany({
      where: { id: { in: bookmarkedIds } },
      select: {
        categories: { select: { categoryId: true } },
        technologies: { select: { technologyId: true } },
      },
    });
    signals.forEach((s) => {
      s.categories.forEach((c) => categoryIds.add(c.categoryId));
      s.technologies.forEach((t) => technologyIds.add(t.technologyId));
    });
  }

  // 1b. Categories/technologies matching the student's profile skills/interests.
  const profile = await db.studentProfile.findUnique({
    where: { userId },
    select: { skills: true, interests: true },
  });
  if (profile?.skills.length) {
    const matches = await db.technology.findMany({
      where: { name: { in: profile.skills, mode: "insensitive" } },
      select: { id: true },
    });
    matches.forEach((t) => technologyIds.add(t.id));
  }
  if (profile?.interests.length) {
    const matches = await db.category.findMany({
      where: { name: { in: profile.interests, mode: "insensitive" } },
      select: { id: true },
    });
    matches.forEach((c) => categoryIds.add(c.id));
  }

  if (categoryIds.size || technologyIds.size) {
    const recs = await db.company.findMany({
      where: {
        deletedAt: null,
        verificationStatus: "VERIFIED",
        id: { notIn: bookmarkedIds }, // don't recommend what they already saved
        OR: [
          categoryIds.size ? { categories: { some: { categoryId: { in: [...categoryIds] } } } } : {},
          technologyIds.size ? { technologies: { some: { technologyId: { in: [...technologyIds] } } } } : {},
        ],
      },
      include: cardInclude,
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: LIMIT,
    });
    if (recs.length > 0) return recs.map(toCard);
  }

  // 2. Cold-start fallback: featured / newest verified companies.
  const fallback = await db.company.findMany({
    where: { deletedAt: null, verificationStatus: "VERIFIED" },
    include: cardInclude,
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: LIMIT,
  });
  return fallback.map(toCard);
}
