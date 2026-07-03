// GET /api/admin/verification-queue — pending companies (ADMIN, TRD §9.2).

import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { assertCan } from "@/lib/rbac";
import { getVerificationQueue } from "@/features/verification/queries";
import { enforceRateLimit, handleRouteError } from "@/lib/api";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const limited = enforceRateLimit(req, "authRead");
  if (limited) return limited;
  try {
    const user = await requireUser();
    assertCan(user, "company:verify");
    const data = await getVerificationQueue();
    return NextResponse.json({ data });
  } catch (e) {
    return handleRouteError(e);
  }
}
