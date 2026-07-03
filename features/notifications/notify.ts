// features/notifications/notify.ts — single notification call-site (TRD §25).
//
// V1: always writes an in-app Notification row; email is sent via Resend for
// email-worthy events. This is deliberately the ONE place notifications are
// created so new channels (push/SMS, V2) don't require touching feature modules.
// Resend wiring is completed in task 5.1; until then email is a no-op-safe path.

import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { sendEmail, notificationEmailHtml, isEmailConfigured } from "@/lib/email";
import type { NotificationType } from "@/types";

/** Events that also send a transactional email (account-critical). */
const EMAIL_WORTHY: ReadonlySet<NotificationType> = new Set([
  "VERIFICATION_APPROVED",
  "VERIFICATION_REJECTED",
  "VERIFICATION_CHANGES_REQUESTED",
  "TEAM_INVITE",
]);

export interface NotifyInput {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  url?: string;
}

/** Create an in-app notification (+ email if email-worthy). Never throws to caller. */
export async function notify(input: NotifyInput): Promise<void> {
  try {
    await db.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        title: input.title,
        body: input.body,
        url: input.url ?? null,
      },
    });

    if (EMAIL_WORTHY.has(input.type)) {
      await maybeSendEmail(input);
    }
  } catch (e) {
    logger.error("notify failed", { userId: input.userId, type: input.type, error: String(e) });
  }
}

/** Notify every OWNER/RECRUITER member of a company (e.g. verification decisions). */
export async function notifyCompany(
  companyId: string,
  input: Omit<NotifyInput, "userId">,
): Promise<void> {
  const members = await db.companyMember.findMany({
    where: { companyId },
    select: { userId: true },
  });
  await Promise.all(members.map((m) => notify({ ...input, userId: m.userId })));
}

async function maybeSendEmail(input: NotifyInput): Promise<void> {
  if (!isEmailConfigured()) {
    logger.debug("email skipped (no RESEND_API_KEY)", { type: input.type });
    return;
  }
  const user = await db.user.findUnique({
    where: { id: input.userId },
    select: { email: true },
  });
  if (!user?.email) return;

  const url = input.url ? absoluteUrl(input.url) : undefined;
  await sendEmail({
    to: user.email,
    subject: input.title,
    html: notificationEmailHtml(input.title, input.body, url),
  });
}

function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}
