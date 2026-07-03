// DELETE /api/bookmarks/:id — remove a bookmark (owner-scoped). Auth required.

import { NextResponse } from "next/server";
import { deleteBookmark } from "@/features/bookmarks/actions";
import { enforceRateLimit, handleRouteError, jsonError } from "@/lib/api";

export const runtime = "nodejs";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const limited = enforceRateLimit(req, "authWrite");
  if (limited) return limited;
  try {
    const { id } = await params;
    const result = await deleteBookmark(id);
    if (!result.success) {
      return jsonError(result.error.code, result.error.message);
    }
    return NextResponse.json({ data: null });
  } catch (e) {
    return handleRouteError(e);
  }
}
