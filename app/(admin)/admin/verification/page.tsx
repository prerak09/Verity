import type { Metadata } from "next";

import { VerificationQueueManager } from "@/features/verification/components/VerificationQueueManager";
import { MOCK_VERIFICATION_QUEUE, MOCK_COMPANY_DETAILS } from "@/components/lib/mocks";

export const metadata: Metadata = {
  title: "Verification Queue",
};

export default function AdminVerificationPage() {
  return (
    <div className="mx-auto max-w-wide px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-neutral-950">Verification Queue</h1>
      <p className="mt-1 text-body text-muted-foreground">
        Oldest submissions first. Cross-check the domain and founder links before deciding.
      </p>
      <div className="mt-6">
        <VerificationQueueManager
          initialQueue={MOCK_VERIFICATION_QUEUE}
          companyDetails={MOCK_COMPANY_DETAILS}
        />
      </div>
    </div>
  );
}
