import type { Metadata } from "next";

import { FeaturedManager } from "@/features/admin/components/FeaturedManager";
import { getAdminCompanies } from "@/features/admin/companies";
import { MOCK_COMPANY_DETAILS } from "@/components/lib/mocks";
import type { CompanyDetail } from "@/types";

export const metadata: Metadata = {
  title: "Featured",
};

export const dynamic = "force-dynamic";

export default async function AdminFeaturedPage() {
  let companies: CompanyDetail[] = Object.values(MOCK_COMPANY_DETAILS);
  try {
    companies = await getAdminCompanies();
  } catch {
    // DB unreachable — fall back to mock data rather than a hard 500.
  }

  return (
    <div className="mx-auto max-w-wide px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-neutral-950">Featured</h1>
      <p className="mt-1 text-body text-muted-foreground">
        Verified companies shown in the Student Dashboard&apos;s Featured module.
      </p>
      <div className="mt-6 max-w-2xl">
        <FeaturedManager companies={companies} />
      </div>
    </div>
  );
}
