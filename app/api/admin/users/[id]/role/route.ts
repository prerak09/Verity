// POST /api/admin/users/:id/role — change a user's platform role (ADMIN, TRD §9.2).

import { NextResponse } from "next/server";
import { changeUserRole } from "@/features/admin/users";
import { enforceRateLimit, handleRouteError, jsonError } from "@/lib/api";
import type { PlatformRole } from "@/types";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const limited = enforceRateLimit(req, "authWrite");
  if (limited) return limited;
  try {
    const { id } = await params;
    const body = (await req.json()) as { role: PlatformRole };
    const result = await changeUserRole({ userId: id, role: body.role });
    if (!result.success) {
      return jsonError(result.error.code, result.error.message, {
        fieldErrors: result.error.fieldErrors,
      });
    }
    return NextResponse.json({ data: null });
  } catch (e) {
    return handleRouteError(e);
  }
}
