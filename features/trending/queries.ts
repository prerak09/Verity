// features/trending/queries.ts — read the precomputed trending list (TRD §13).

import { db } from "@/lib/db";
import type { CompanyCard } from "@/types";

/** Top trending companies from the latest snapshot (O(1) dashboard read). */
export async function getTrendingCompanies(limit = 8): Promise<CompanyCard[]> {
  const snapshots = await db.trendingSnapshot.findMany({
    orderBy: { rank: "asc" },
    take: limit,
  });
  if (snapshots.length === 0) {
    // No snapshot yet (fresh install / low activity) → featured fallback.
    const featured = await db.company.findMany({
      where: { deletedAt: null, verificationStatus: "VERIFIED" },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: limit,
      include: {
        categories: { include: { category: true } },
        _count: { select: { internships: { where: { status: "PUBLISHED", deletedAt: null } } } },
      },
    });
    return featured.map(mapCard);
  }

  const companies = await db.company.findMany({
    where: { id: { in: snapshots.map((s) => s.companyId) }, deletedAt: null },
    include: {
      categories: { include: { category: true } },
      _count: { select: { internships: { where: { status: "PUBLISHED", deletedAt: null } } } },
    },
  });
  const byId = new Map(companies.map((c) => [c.id, c]));
  // Preserve snapshot rank order.
  return snapshots
    .map((s) => byId.get(s.companyId))
    .filter((c): c is NonNullable<typeof c> => !!c)
    .map(mapCard);
}

type CompanyWithRels = {
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
};

function mapCard(c: CompanyWithRels): CompanyCard {
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
