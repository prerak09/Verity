// /api/bookmarks — student-scoped bookmark create/list (TRD §9.2). Auth required.

import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { listBookmarks } from "@/features/bookmarks/queries";
import { createBookmark } from "@/features/bookmarks/actions";
import { enforceRateLimit, handleRouteError, jsonError } from "@/lib/api";
import type { BookmarkTargetType, CreateBookmarkInput } from "@/types";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const limited = enforceRateLimit(req, "authRead");
  if (limited) return limited;
  try {
    const user = await requireUser();
    const url = new URL(req.url);
    const type = url.searchParams.get("targetType") as BookmarkTargetType | null;
    const data = await listBookmarks(user.id, type ?? undefined);
    return NextResponse.json({ data });
  } catch (e) {
    return handleRouteError(e);
  }
}

export async function POST(req: Request) {
  const limited = enforceRateLimit(req, "authWrite");
  if (limited) return limited;
  try {
    const body = (await req.json()) as CreateBookmarkInput;
    const result = await createBookmark(body);
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
