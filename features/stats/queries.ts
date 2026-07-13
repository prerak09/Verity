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
