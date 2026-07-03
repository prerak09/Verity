// GET /api/admin/reports — reports queue (ADMIN, TRD §9.2).

import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { assertCan } from "@/lib/rbac";
import { getReportsQueue } from "@/features/admin/reports";
import { enforceRateLimit, handleRouteError } from "@/lib/api";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const limited = enforceRateLimit(req, "authRead");
  if (limited) return limited;
  try {
    const user = await requireUser();
    assertCan(user, "report:handle");
    const data = await getReportsQueue();
    return NextResponse.json({ data });
  } catch (e) {
    return handleRouteError(e);
  }
}
