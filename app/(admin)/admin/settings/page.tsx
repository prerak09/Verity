import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SettingsForm } from "@/features/settings/components/SettingsForm";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Settings",
};

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="mx-auto max-w-wide px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-neutral-950">Settings</h1>
      <p className="mt-1 text-body text-muted-foreground">
        Manage your account preferences.
      </p>
      <div className="mt-8">
        <SettingsForm initialEmailNotificationsEnabled={user.emailNotificationsEnabled} />
      </div>
    </div>
  );
}
