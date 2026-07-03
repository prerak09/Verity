// /api/applications — student tracker list/create (TRD §9.2). Auth required.
// Private data (FR-44): always scoped to the current user.

import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { listApplications } from "@/features/applications/queries";
import { createApplication } from "@/features/applications/actions";
import { enforceRateLimit, handleRouteError, jsonError } from "@/lib/api";
import type { CreateApplicationInput } from "@/types";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const limited = enforceRateLimit(req, "authRead");
  if (limited) return limited;
  try {
    const user = await requireUser();
    const data = await listApplications(user.id);
    return NextResponse.json({ data });
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(req: Request) {
  const limited = enforceRateLimit(req, "authWrite");
  if (limited) return limited;
  try {
    const body = (await req.json()) as CreateApplicationInput;
    const result = await createApplication(body);
    if (!result.success) {
      return jsonError(result.error.code, result.error.message, {
        fieldErrors: result.error.fieldErrors,
      });
    }
    return NextResponse.json({ data: result.data }, { status: 201 });
  } catch (e) {
    return handleRouteError(e);
  }
}
