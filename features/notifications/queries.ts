// features/notifications/queries.ts — notification reads for the bell/center UI.

import { db } from "@/lib/db";
import type { NotificationDTO, NotificationType } from "@/types";

export async function listNotifications(userId: string): Promise<NotificationDTO[]> {
  const rows = await db.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return rows.map((n) => ({
    id: n.id,
    type: n.type as NotificationType,
    title: n.title,
    body: n.body,
    url: n.url,
    read: n.read,
    createdAt: n.createdAt.toISOString(),
  }));
}

export async function getUnreadCount(userId: string): Promise<number> {
  return db.notification.count({ where: { userId, read: false } });
}
