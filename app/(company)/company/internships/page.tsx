import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { InternshipManager } from "@/features/internships/components/InternshipManager";
import { getCurrentUser } from "@/lib/auth";
import { getAdminCompanyById } from "@/features/admin/companies";
import { EmptyState } from "@/components/shared/EmptyState";
import { Building2 } from "lucide-react";
import type { InternshipDetail, VerificationStatus } from "@/types";

export const metadata: Metadata = {
  title: "Internships",
};

export const dynamic = "force-dynamic";

export default async function CompanyInternshipsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const membership = user.memberships[0];

  let internships: InternshipDetail[] = [];
  let companyId = "";
  let verificationStatus: VerificationStatus = "UNVERIFIED";

  if (membership) {
    try {
      const result = await getAdminCompanyById(membership.companyId);
      if (result) {
        companyId = result.company.id;
        verificationStatus = result.company.verificationStatus;
        internships = result.internships;
      }
    } catch {
      // fall through to empty state
    }
  }

  return (
    <div className="mx-auto max-w-wide px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-neutral-950">Internships &amp; jobs</h1>
      <p className="mt-1 text-body text-muted-foreground">
        Manage your listings — draft, publish, and close roles.
      </p>
      <div className="mt-6">
        {membership && companyId ? (
          <InternshipManager
            companyId={companyId}
            companyVerificationStatus={verificationStatus}
            initialInternships={internships}
          />
        ) : (
          <EmptyState
            icon={Building2}
            title="Register your company first"
            description="You need a company profile before you can post internships or jobs."
            action={{ label: "Register your company", href: "/company-onboarding" }}
          />
        )}
      </div>
    </div>
  );
}
