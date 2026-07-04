import type { Metadata } from "next";

import { AuthShell } from "@/components/shared/AuthShell";
import { OnboardingForm } from "@/features/companies/components/OnboardingForm";

export const metadata: Metadata = {
  title: "Register your company",
};

/**
 * Deliberately outside the (company) route group: middleware gates
 * /company(.*) to COMPANY/ADMIN role, but a user registering a company
 * for the first time is still STUDENT-role until registerCompany's
 * transaction elevates them — this route just needs any authenticated
 * session, which it gets by not matching any gated prefix.
 */
export default function CompanyOnboardingPage() {
  return (
    <AuthShell>
      <div className="w-full max-w-md rounded-xl border-2 border-border bg-card p-6 shadow-brutal-md">
        <h1 className="text-h2 text-foreground">Register your company</h1>
        <p className="mt-1 text-body-sm text-muted-foreground">
          Takes about two minutes. An Admin verifies your domain before your
          profile goes live.
        </p>
        <div className="mt-6">
          <OnboardingForm />
        </div>
      </div>
    </AuthShell>
  );
}
