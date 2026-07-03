// features/trending/aggregate.ts — trending snapshot aggregation (TRD §13).
//
// Runs on a schedule (Vercel Cron → /api/cron/trending). Computes a score per
// verified company from recent views + bookmarks, writes a fresh TrendingSnapshot
// set, so dashboard reads stay O(1). Old snapshots are pruned.

import { db } from "@/lib/db";
import { logger } from "@/lib/logger";

const WINDOW_DAYS = 7;
const VIEW_WEIGHT = 1;
const BOOKMARK_WEIGHT = 4; // a bookmark is a stronger intent signal than a view
const TOP_N = 50;

export async function computeTrendingSnapshot(windowDays = WINDOW_DAYS): Promise<number> {
  const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);

  // Aggregate recent views + bookmarks per company in two grouped queries.
  const [viewRows, bookmarkRows] = await Promise.all([
    db.analyticsEvent.groupBy({
      by: ["companyId"],
      where: { type: "COMPANY_VIEW", companyId: { not: null }, createdAt: { gte: since } },
      _count: { _all: true },
    }),
    db.bookmark.groupBy({
      by: ["companyId"],
      where: { targetType: "COMPANY", companyId: { not: null }, createdAt: { gte: since } },
      _count: { _all: true },
    }),
  ]);

  const scores = new Map<string, number>();
  for (const r of viewRows) {
    if (r.companyId) scores.set(r.companyId, (scores.get(r.companyId) ?? 0) + r._count._all * VIEW_WEIGHT);
  }
  for (const r of bookmarkRows) {
    if (r.companyId) scores.set(r.companyId, (scores.get(r.companyId) ?? 0) + r._count._all * BOOKMARK_WEIGHT);
  }

  // Only rank verified, non-deleted companies.
  const verified = await db.company.findMany({
    where: { deletedAt: null, verificationStatus: "VERIFIED" },
    select: { id: true, isFeatured: true },
  });
  const verifiedIds = new Set(verified.map((c) => c.id));

  const ranked = [...scores.entries()]
    .filter(([companyId]) => verifiedIds.has(companyId))
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_N);

  const computedAt = new Date();
  await db.$transaction(async (tx) => {
    // Fresh snapshot set; prune everything older than this run.
    await tx.trendingSnapshot.deleteMany({});
    if (ranked.length > 0) {
      await tx.trendingSnapshot.createMany({
        data: ranked.map(([companyId, score], i) => ({
          companyId,
          score,
          rank: i + 1,
          windowDays,
          computedAt,
        })),
      });
    }
  });

  logger.info("trending snapshot computed", { count: ranked.length, windowDays });
  return ranked.length;
}
