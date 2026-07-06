"use server";

// features/settings/actions.ts — account-level settings mutations.
// "settings:update:own" is granted to every role — this manages the user's
// own notification preference (User.emailNotificationsEnabled), not a
// resource tied to any single portal.

import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { assertCan } from "@/lib/rbac";
import { handleAction } from "@/lib/action";
import type { Result } from "@/types";

export async function updateEmailNotifications(
  enabled: boolean,
): Promise<Result<{ emailNotificationsEnabled: boolean }>> {
  return handleAction(async () => {
    const user = await requireUser();
    assertCan(user, "settings:update:own");
    await db.user.update({
      where: { id: user.id },
      data: { emailNotificationsEnabled: enabled },
    });
    return { emailNotificationsEnabled: enabled };
  });
}
