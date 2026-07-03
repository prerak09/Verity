// PATCH /api/admin/reports/:id — resolve a report (ADMIN, TRD §9.2).

import { NextResponse } from "next/server";
import { resolveReport, type ResolveAction } from "@/features/admin/reports";
import { enforceRateLimit, handleRouteError, jsonError } from "@/lib/api";

export const runtime = "nodejs";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const limited = enforceRateLimit(req, "authWrite");
  if (limited) return limited;
  try {
    const { id } = await params;
    const body = (await req.json()) as { action: ResolveAction; note?: string };
    const result = await resolveReport(id, body.action, body.note);
    if (!result.success) return jsonError(result.error.code, result.error.message);
    return NextResponse.json({ data: null });
  } catch (e) {
    return handleRouteError(e);
  }
}
