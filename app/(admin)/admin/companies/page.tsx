import type { Metadata } from "next";

import { AdminCompaniesManager } from "@/features/admin/components/AdminCompaniesManager";
import { getAdminCompanies } from "@/features/admin/companies";
import type { CompanyDetail } from "@/types";

export const metadata: Metadata = {
  title: "Companies",
};

export const dynamic = "force-dynamic";

export default async function AdminCompaniesPage() {
  let companies: CompanyDetail[] = [];

  try {
    companies = await getAdminCompanies();
  } catch {
    // DB unreachable — render an empty manager rather than a hard 500.
  }

  return (
    <div className="mx-auto max-w-wide px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-neutral-950">Companies</h1>
      <p className="mt-1 text-body text-muted-foreground">
        Add companies, then click Manage to edit a profile and add its
        internships &amp; jobs.
      </p>
      <div className="mt-6">
        <AdminCompaniesManager initialCompanies={companies} />
      </div>
    </div>
  );
}
