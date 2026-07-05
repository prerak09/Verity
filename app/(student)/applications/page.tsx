import type { Metadata } from "next";

import { ApplicationTracker } from "@/features/applications/components/ApplicationTracker";
import { getCurrentUser } from "@/lib/auth";
import { listApplications } from "@/features/applications/queries";
import type { ApplicationDTO } from "@/types";

export const metadata: Metadata = {
  title: "Application Tracker",
};

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  let applications: ApplicationDTO[] = [];
  try {
    const user = await getCurrentUser();
    if (user) applications = await listApplications(user.id);
  } catch {
    // ignore — render empty tracker
  }

  return (
    <div className="mx-auto max-w-wide px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-neutral-950">Application Tracker</h1>
      <p className="mt-1 text-body text-muted-foreground">
        Track every internship from Saved to Offer. Notes are private to you.
      </p>
      <div className="mt-6">
        <ApplicationTracker applications={applications} />
      </div>
    </div>
  );
}
