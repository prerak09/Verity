import type { Metadata } from "next";

import { FeaturedManager } from "@/features/admin/components/FeaturedManager";
import { MOCK_COMPANY_DETAILS } from "@/components/lib/mocks";

export const metadata: Metadata = {
  title: "Featured",
};

export default function AdminFeaturedPage() {
  return (
    <div className="mx-auto max-w-wide px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-neutral-950">Featured</h1>
      <p className="mt-1 text-body text-muted-foreground">
        Verified companies shown in the Student Dashboard&apos;s Featured module.
      </p>
      <div className="mt-6 max-w-2xl">
        <FeaturedManager companies={Object.values(MOCK_COMPANY_DETAILS)} />
      </div>
    </div>
  );
}
