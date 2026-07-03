// GET /api/cron/digest — daily digest cron (FR-61). CRON_SECRET protected.

import { NextResponse } from "next/server";
import { sendDailyDigest } from "@/features/notifications/digest";
import { handleRouteError } from "@/lib/api";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (secret && auth !== `Bearer ${secret}`) {
    logger.warn("digest cron: unauthorized");
    return NextResponse.json({ error: { code: "FORBIDDEN", message: "Forbidden" } }, { status: 403 });
  }
  try {
    const sent = await sendDailyDigest();
    return NextResponse.json({ data: { notifications: sent } });
  } catch (e) {
    return handleRouteError(e);
  }
}
