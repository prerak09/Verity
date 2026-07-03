// features/notifications/digest.ts — daily digest (FR-61).
//
// For each internship published in the last day, notify every student who has
// bookmarked that internship's company. Runs via Vercel Cron (/api/cron/digest).
// Idempotency: we look at a fixed lookback window; running twice in a day could
// double-notify, so the cron is scheduled once daily.

import { db } from "@/lib/db";
import { notify } from "./notify";
import { logger } from "@/lib/logger";

export async function sendDailyDigest(lookbackHours = 24): Promise<number> {
  const since = new Date(Date.now() - lookbackHours * 60 * 60 * 1000);

  // New internships published in the window, with their company.
  const fresh = await db.internship.findMany({
    where: {
      status: "PUBLISHED",
      deletedAt: null,
      publishedAt: { gte: since },
    },
    include: {
      company: { select: { id: true, slug: true, name: true } },
    },
  });

  let sent = 0;
  for (const internship of fresh) {
    // Students who bookmarked this company (FR-61 signal).
    const bookmarkers = await db.bookmark.findMany({
      where: { targetType: "COMPANY", companyId: internship.company.id },
      select: { userId: true },
    });
    for (const b of bookmarkers) {
      await notify({
        userId: b.userId,
        type: "BOOKMARKED_COMPANY_NEW_INTERNSHIP",
        title: `${internship.company.name} posted a new internship`,
        body: internship.title,
        url: `/internships/${internship.slug}`,
      });
      sent++;
    }
  }

  logger.info("daily digest sent", { internships: fresh.length, notifications: sent });
  return sent;
}
