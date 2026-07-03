"use server";

// features/notifications/actions.ts — mark notifications read (own only).

import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { handleAction } from "@/lib/action";
import type { Result } from "@/types";

export async function markNotificationRead(id: string): Promise<Result<null>> {
  return handleAction(async () => {
    const user = await requireUser();
    // Layer 3: scoped to the owning user.
    await db.notification.updateMany({
      where: { id, userId: user.id },
      data: { read: true },
    });
    return null;
  });
}

export async function markAllNotificationsRead(): Promise<Result<null>> {
  return handleAction(async () => {
    const user = await requireUser();
    await db.notification.updateMany({
      where: { userId: user.id, read: false },
      data: { read: true },
    });
    return null;
  });
}
