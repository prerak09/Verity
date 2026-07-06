import type { Metadata } from "next";

import { VerificationQueueManager } from "@/features/verification/components/VerificationQueueManager";
import { getVerificationQueue } from "@/features/verification/queries";
import { getAdminCompanies } from "@/features/admin/companies";
import { MOCK_VERIFICATION_QUEUE, MOCK_COMPANY_DETAILS } from "@/components/lib/mocks";
import type { VerificationQueueItem, CompanyDetail } from "@/types";

export const metadata: Metadata = {
  title: "Verification Queue",
};

export const dynamic = "force-dynamic";

export default async function AdminVerificationPage() {
  let queue: VerificationQueueItem[] = MOCK_VERIFICATION_QUEUE;
  let companyDetails: Record<string, CompanyDetail> = MOCK_COMPANY_DETAILS;

  try {
    const [verificationQueue, companies] = await Promise.all([
      getVerificationQueue(),
      getAdminCompanies(),
    ]);
    queue = verificationQueue;
    companyDetails = Object.fromEntries(companies.map((c) => [c.slug, c]));
  } catch {
    // DB unreachable — fall back to mock data rather than a hard 500.
  }

  return (
    <div className="mx-auto max-w-wide px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-neutral-950">Verification Queue</h1>
      <p className="mt-1 text-body text-muted-foreground">
        Oldest submissions first. Cross-check the domain and founder links before deciding.
      </p>
      <div className="mt-6">
        <VerificationQueueManager initialQueue={queue} companyDetails={companyDetails} />
      </div>
    </div>
  );
}
