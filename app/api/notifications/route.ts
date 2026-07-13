// GET /api/notifications — the current user's notifications (PRD §20).

import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { listNotifications } from "@/features/notifications/queries";
import { handleRouteError } from "@/lib/api";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await requireUser();
    const data = await listNotifications(user.id);
    return NextResponse.json({ data });
  } catch (e) {
    return handleRouteError(e);
  }
}
