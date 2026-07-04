"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";

import {
  markNotificationRead,
  markAllNotificationsRead,
} from "@/features/notifications/actions";
import { MOCK_NOTIFICATIONS } from "@/components/lib/mocks";
import type { NotificationDTO } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function relativeTime(iso: string) {
  const ms = Date.now() - new Date(iso).getTime();
  const hours = Math.round(ms / 3_600_000);
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function NotificationRow({
  notification,
  onRead,
}: {
  notification: NotificationDTO;
  onRead: (id: string) => void;
}) {
  const content = (
    <div
      className={`rounded-lg border-2 p-3 transition-colors ${
        notification.read
          ? "border-border-subtle bg-card"
          : "border-border bg-accent"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-body-sm font-medium text-foreground">{notification.title}</p>
        {!notification.read && (
          <span aria-hidden className="mt-1 size-2 shrink-0 rounded-full bg-primary" />
        )}
      </div>
      <p className="mt-0.5 text-body-sm text-muted-foreground">{notification.body}</p>
      <p className="mt-1 text-caption text-muted-foreground">{relativeTime(notification.createdAt)}</p>
    </div>
  );

  function handleClick() {
    if (!notification.read) onRead(notification.id);
  }

  return notification.url ? (
    <Link href={notification.url} onClick={handleClick} className="block">
      {content}
    </Link>
  ) : (
    <button type="button" onClick={handleClick} className="block w-full text-left">
      {content}
    </button>
  );
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => !n.read).length;

  async function handleRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    const result = await markNotificationRead(id);
    if (!result.success) {
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: false } : n)));
    }
  }

  async function handleMarkAllRead() {
    const prev = notifications;
    setNotifications((p) => p.map((n) => ({ ...n, read: true })));
    const result = await markAllNotificationsRead();
    if (!result.success) setNotifications(prev);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        className="relative"
        onClick={() => setOpen(true)}
      >
        <Bell className="size-5" aria-hidden />
        {unreadCount > 0 && (
          <span
            aria-hidden
            className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-semibold text-white"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
        </DialogHeader>
        {notifications.length === 0 ? (
          <p className="py-6 text-center text-body-sm text-muted-foreground">You&apos;re all caught up.</p>
        ) : (
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {notifications.map((n) => (
              <NotificationRow key={n.id} notification={n} onRead={handleRead} />
            ))}
          </div>
        )}
        {unreadCount > 0 && (
          <DialogFooter>
            <Button type="button" variant="outline" size="sm" onClick={handleMarkAllRead}>
              Mark all as read
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
