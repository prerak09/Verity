// features/bookmarks/queries.ts — bookmark reads (FR-40/41). Always user-scoped.

import { db } from "@/lib/db";
import { toInternshipCard } from "@/features/internships/map";
import type { BookmarkDTO, BookmarkTargetType, CompanyCard } from "@/types";

/** All bookmarks for a user, newest first; optionally filtered by target type. */
export async function listBookmarks(
  userId: string,
  targetType?: BookmarkTargetType,
): Promise<BookmarkDTO[]> {
  const rows = await db.bookmark.findMany({
    where: { userId, ...(targetType ? { targetType } : {}) },
    orderBy: { createdAt: "desc" },
    include: {
      company: {
        include: {
          categories: { include: { category: true } },
          _count: {
            select: {
              internships: { where: { status: "PUBLISHED", deletedAt: null } },
            },
          },
        },
      },
      internship: {
        include: {
          company: { select: { id: true, slug: true, name: true, logoUrl: true } },
        },
      },
    },
  });

  return rows.map((b) => {
    const company: CompanyCard | null = b.company
      ? {
          id: b.company.id,
          slug: b.company.slug,
          name: b.company.name,
          tagline: b.company.tagline,
          logoUrl: b.company.logoUrl,
          fundingStage: b.company.fundingStage,
          remotePolicy: b.company.remotePolicy,
          verified: b.company.verificationStatus === "VERIFIED",
          categories: b.company.categories.map((cc) => ({
            id: cc.category.id,
            slug: cc.category.slug,
            name: cc.category.name,
          })),
          openInternshipCount: b.company._count.internships,
        }
      : null;

    return {
      id: b.id,
      targetType: b.targetType,
      createdAt: b.createdAt.toISOString(),
      company,
      internship: b.internship
        ? toInternshipCard(b.internship, b.internship.company)
        : null,
    };
  });
}

/** Set of target ids the user has bookmarked (for toggling UI state). */
export async function getBookmarkedIds(
  userId: string,
  targetType: BookmarkTargetType,
): Promise<Set<string>> {
  const rows = await db.bookmark.findMany({
    where: { userId, targetType },
    select: { companyId: true, internshipId: true },
  });
  const ids = rows.map((r) =>
    targetType === "COMPANY" ? r.companyId : r.internshipId,
  );
  return new Set(ids.filter((id): id is string => !!id));
}
