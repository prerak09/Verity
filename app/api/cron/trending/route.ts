// GET /api/cron/trending — Vercel Cron trigger for trending aggregation (TRD §13).
// Protected by CRON_SECRET (Vercel sends it as a Bearer token). Not a public route.

import { NextResponse } from "next/server";
import { computeTrendingSnapshot } from "@/features/trending/aggregate";
import { handleRouteError } from "@/lib/api";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (secret && auth !== `Bearer ${secret}`) {
    logger.warn("trending cron: unauthorized");
    return NextResponse.json({ error: { code: "FORBIDDEN", message: "Forbidden" } }, { status: 403 });
  }

  try {
    const count = await computeTrendingSnapshot();
    return NextResponse.json({ data: { ranked: count } });
  } catch (e) {
    return handleRouteError(e);
  }
}
