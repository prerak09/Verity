import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ProfileForm } from "@/features/students/components/ProfileForm";
import { getCurrentUser } from "@/lib/auth";
import { getStudentProfile } from "@/features/students/queries";
import { MOCK_STUDENT_PROFILE } from "@/components/lib/mocks";
import type { StudentProfileDTO } from "@/types";

export const metadata: Metadata = {
  title: "Profile settings",
};

export const dynamic = "force-dynamic";

export default async function StudentProfileSettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  let profile: StudentProfileDTO;
  try {
    // Profile row is created lazily on first save; until then we seed the form
    // from the user's identity (name/email always present).
    profile =
      (await getStudentProfile(user.id)) ?? {
        id: "",
        userId: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        college: null,
        gradYear: null,
        resumeUrl: null,
        bio: null,
      };
  } catch {
    profile = MOCK_STUDENT_PROFILE;
  }

  return (
    <div className="mx-auto max-w-wide px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-neutral-950">Profile settings</h1>
      <p className="mt-1 text-body text-muted-foreground">
        This is what companies and Verity see about you.
      </p>
      <div className="mt-8">
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
