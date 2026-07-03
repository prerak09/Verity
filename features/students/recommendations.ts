// features/students/recommendations.ts — rules-based recommended companies (PRD §14.1).
//
// V1 has no ML: we recommend by OVERLAP of category/technology between the
// companies a student already bookmarked and other verified companies. Falls
// back to featured companies for a cold-start (no bookmarks yet).

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
  // 1. Categories/technologies the student has signalled interest in via bookmarks.
  const bookmarked = await db.bookmark.findMany({
    where: { userId, targetType: "COMPANY", companyId: { not: null } },
    select: { companyId: true },
  });
  const bookmarkedIds = bookmarked
    .map((b) => b.companyId)
    .filter((id): id is string => !!id);

  if (bookmarkedIds.length > 0) {
    const signals = await db.company.findMany({
      where: { id: { in: bookmarkedIds } },
      select: {
        categories: { select: { categoryId: true } },
        technologies: { select: { technologyId: true } },
      },
    });
    const categoryIds = [...new Set(signals.flatMap((s) => s.categories.map((c) => c.categoryId)))];
    const technologyIds = [...new Set(signals.flatMap((s) => s.technologies.map((t) => t.technologyId)))];

    if (categoryIds.length || technologyIds.length) {
      const recs = await db.company.findMany({
        where: {
          deletedAt: null,
          verificationStatus: "VERIFIED",
          id: { notIn: bookmarkedIds }, // don't recommend what they already saved
          OR: [
            categoryIds.length ? { categories: { some: { categoryId: { in: categoryIds } } } } : {},
            technologyIds.length ? { technologies: { some: { technologyId: { in: technologyIds } } } } : {},
          ],
        },
        include: cardInclude,
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
        take: LIMIT,
      });
      if (recs.length > 0) return recs.map(toCard);
    }
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
