import type { Metadata } from "next";

import { AdminCompaniesManager } from "@/features/admin/components/AdminCompaniesManager";
import { MOCK_COMPANY_DETAILS, MOCK_INTERNSHIPS } from "@/components/lib/mocks";

export const metadata: Metadata = {
  title: "Companies",
};

export default function AdminCompaniesPage() {
  return (
    <div className="mx-auto max-w-wide px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-neutral-950">Companies</h1>
      <p className="mt-1 text-body text-muted-foreground">
        Create companies (seed path), suspend/reinstate, and moderate internships.
      </p>
      <div className="mt-6">
        <AdminCompaniesManager
          initialCompanies={Object.values(MOCK_COMPANY_DETAILS)}
          initialInternships={MOCK_INTERNSHIPS}
        />
      </div>
    </div>
  );
}
