// PATCH/DELETE /api/applications/:id — update status/notes, remove (owner-only).

import { NextResponse } from "next/server";
import { updateApplication, deleteApplication } from "@/features/applications/actions";
import { enforceRateLimit, handleRouteError, jsonError } from "@/lib/api";
import type { UpdateApplicationInput } from "@/types";

export const runtime = "nodejs";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const limited = enforceRateLimit(req, "authWrite");
  if (limited) return limited;
  try {
    const { id } = await params;
    const body = (await req.json()) as UpdateApplicationInput;
    const result = await updateApplication(id, body);
    if (!result.success) {
      return jsonError(result.error.code, result.error.message, {
        fieldErrors: result.error.fieldErrors,
      });
    }
    return NextResponse.json({ data: result.data });
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const limited = enforceRateLimit(req, "authWrite");
  if (limited) return limited;
  try {
    const { id } = await params;
    const result = await deleteApplication(id);
    if (!result.success) return jsonError(result.error.code, result.error.message);
    return NextResponse.json({ data: null });
  } catch (e) {
    return handleRouteError(e);
  }
}
