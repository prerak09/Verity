import type { Metadata } from "next";

import { AdminCompaniesManager } from "@/features/admin/components/AdminCompaniesManager";
import { getAdminCompanies } from "@/features/admin/companies";
import { listAllInternshipsForAdmin } from "@/features/internships/queries";
import { MOCK_COMPANY_DETAILS, MOCK_INTERNSHIPS } from "@/components/lib/mocks";
import type { CompanyDetail, InternshipCard } from "@/types";

export const metadata: Metadata = {
  title: "Companies",
};

export const dynamic = "force-dynamic";

export default async function AdminCompaniesPage() {
  let companies: CompanyDetail[] = Object.values(MOCK_COMPANY_DETAILS);
  let internships: InternshipCard[] = MOCK_INTERNSHIPS;

  try {
    const [adminCompanies, adminInternships] = await Promise.all([
      getAdminCompanies(),
      listAllInternshipsForAdmin(),
    ]);
    companies = adminCompanies;
    internships = adminInternships;
  } catch {
    // DB unreachable — fall back to mock data rather than a hard 500.
  }

  return (
    <div className="mx-auto max-w-wide px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-neutral-950">Companies</h1>
      <p className="mt-1 text-body text-muted-foreground">
        Create companies (seed path), suspend/reinstate, and moderate internships.
      </p>
      <div className="mt-6">
        <AdminCompaniesManager initialCompanies={companies} initialInternships={internships} />
      </div>
    </div>
  );
}
