// features/stats/queries.ts — real platform counts for the landing page.
//
// Replaces the previously hardcoded "12K+ / 48K+ / 100%" hero figures with
// live counts so the marketing surface never over-claims (audit ISSUE-003).

import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";

export interface PlatformStats {
  verifiedCompanies: number;
  openInternships: number;
  totalStudents: number;
  countries: number;
}

async function getPlatformStatsUncached(): Promise<PlatformStats> {
  const [verifiedCompanies, openInternships, totalStudents, hqLocations] =
    await Promise.all([
      db.company.count({
        where: { deletedAt: null, verificationStatus: "VERIFIED" },
      }),
      db.internship.count({
        where: {
          status: "PUBLISHED",
          deletedAt: null,
          company: { deletedAt: null, verificationStatus: "VERIFIED" },
        },
      }),
      db.user.count({ where: { role: "STUDENT" } }),
      db.companyLocation.findMany({
        where: { company: { deletedAt: null, verificationStatus: "VERIFIED" } },
        select: { country: true },
        distinct: ["country"],
      }),
    ]);

  return {
    verifiedCompanies,
    openInternships,
    totalStudents,
    countries: hqLocations.filter((l) => l.country).length,
  };
}

/** Cached 5 min — these move slowly and the landing page is high-traffic. */
export function getPlatformStats(): Promise<PlatformStats> {
  return unstable_cache(getPlatformStatsUncached, ["platform-stats"], {
    tags: ["companies:list", "internships:list"],
    revalidate: 300,
  })();
}

export interface FeaturedLogo {
  slug: string;
  name: string;
  logoUrl: string;
}

async function getFeaturedLogosUncached(limit: number): Promise<FeaturedLogo[]> {
  const rows = await db.company.findMany({
    where: {
      deletedAt: null,
      verificationStatus: "VERIFIED",
      logoUrl: { not: null },
    },
    // Featured first, then the freshest — keeps the strip lively without a
    // random shuffle that would bust the cache every request.
    orderBy: [{ isFeatured: "desc" }, { updatedAt: "desc" }],
    take: limit,
    select: { slug: true, name: true, logoUrl: true },
  });
  return rows
    .filter((r): r is FeaturedLogo => Boolean(r.logoUrl))
    .map((r) => ({ slug: r.slug, name: r.name, logoUrl: r.logoUrl }));
}

/** Verified companies that actually have a logo, for the landing-page strip. */
export function getFeaturedLogos(limit = 12): Promise<FeaturedLogo[]> {
  return unstable_cache(
    () => getFeaturedLogosUncached(limit),
    ["featured-logos", String(limit)],
    { tags: ["companies:list"], revalidate: 300 },
  )();
}
