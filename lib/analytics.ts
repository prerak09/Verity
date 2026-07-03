// lib/analytics.ts — first-party event instrumentation (PRD §19.3, FR-33).
//
// V1 writes events to the AnalyticsEvent table (no third-party tool). Company-
// facing analytics only ever read AGGREGATES from these (NFR §13.6); raw rows
// with userId are never exposed to companies.

import { db } from "@/lib/db";
import { logger } from "@/lib/logger";

/** Record a company profile view (PRD §19.3). Fire-and-forget; never blocks UX. */
export async function recordCompanyView(companyId: string, userId?: string): Promise<void> {
  try {
    await db.analyticsEvent.create({
      data: { type: "COMPANY_VIEW", companyId, userId: userId ?? null },
    });
  } catch (e) {
    logger.warn("recordCompanyView failed", { companyId, error: String(e) });
  }
}

/** Record an internship view (PRD §19.3). */
export async function recordInternshipView(
  internshipId: string,
  userId?: string,
): Promise<void> {
  try {
    await db.analyticsEvent.create({
      data: { type: "INTERNSHIP_VIEW", internshipId, userId: userId ?? null },
    });
  } catch (e) {
    logger.warn("recordInternshipView failed", { internshipId, error: String(e) });
  }
}

/** Log a search term for admin "top terms / unmet demand" analytics (FR-33). */
export async function logSearchQuery(
  term: string,
  resultCount: number,
  userId?: string,
): Promise<void> {
  const trimmed = term.trim();
  if (!trimmed) return;
  try {
    await db.searchQueryLog.create({
      data: { term: trimmed.slice(0, 200), resultCount, userId: userId ?? null },
    });
  } catch (e) {
    logger.warn("logSearchQuery failed", { error: String(e) });
  }
}
