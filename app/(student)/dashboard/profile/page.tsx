import type { Metadata } from "next";

import { ProfileForm } from "@/features/students/components/ProfileForm";
import { MOCK_STUDENT_PROFILE } from "@/components/lib/mocks";

export const metadata: Metadata = {
  title: "Profile settings",
};

export default function StudentProfileSettingsPage() {
  return (
    <div className="mx-auto max-w-wide px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-neutral-950">Profile settings</h1>
      <p className="mt-1 text-body text-muted-foreground">
        This is what companies and Verity see about you.
      </p>
      <div className="mt-8">
        <ProfileForm profile={MOCK_STUDENT_PROFILE} />
      </div>
    </div>
  );
}
