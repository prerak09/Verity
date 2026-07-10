import type { Metadata } from "next";

import { AdminInternshipsTable } from "@/features/admin/components/AdminInternshipsTable";
import { listAllInternshipsForAdmin } from "@/features/internships/queries";
import type { InternshipCard } from "@/types";

export const metadata: Metadata = {
  title: "Internships",
};

export const dynamic = "force-dynamic";

export default async function AdminInternshipsPage() {
  let internships: InternshipCard[] = [];
  try {
    internships = await listAllInternshipsForAdmin("internship");
  } catch {
    // DB unreachable — render empty table rather than a hard 500.
  }

  return (
    <div className="mx-auto max-w-wide px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-neutral-950">
        Internships
      </h1>
      <p className="mt-1 text-body text-muted-foreground">
        Every internship across all companies. Add or edit them from a
        company&apos;s Manage page.
      </p>
      <div className="mt-6">
        <AdminInternshipsTable initialInternships={internships} kind="internship" />
      </div>
    </div>
  );
}
