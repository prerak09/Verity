// GET /api/search?q=… — combined company + internship FTS (PRD §16, TRD §12).
// Public + rate-limited. Logs the query for admin analytics (FR-33).

import { NextResponse } from "next/server";
import { searchAll } from "@/lib/search";
import { logSearchQuery } from "@/lib/analytics";
import { enforceRateLimit, handleRouteError, pageParams } from "@/lib/api";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const limited = enforceRateLimit(req, "public");
  if (limited) return limited;

  try {
    const url = new URL(req.url);
    const q = (url.searchParams.get("q") ?? "").trim();
    const { page, pageSize } = pageParams(url);

    if (!q) {
      return NextResponse.json({
        data: { companies: [], internships: [], totalCompanies: 0, totalInternships: 0 },
      });
    }

    const results = await searchAll(q, { page, pageSize });
    // Fire-and-forget analytics (FR-33) — don't block the response.
    void logSearchQuery(q, results.totalCompanies + results.totalInternships);

    return NextResponse.json({ data: results });
  } catch (e) {
    return handleRouteError(e);
  }
}
