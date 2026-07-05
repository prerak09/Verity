import type { Metadata } from "next";

import { Logo } from "@/components/shared/Logo";
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
    <div className="flex min-h-full flex-1 flex-col items-center gap-8 px-4 py-14">
      <Logo />
      <div className="retro-card w-full max-w-lg p-7">
        <span className="retro-eyebrow">Company Onboarding</span>
        <h1 className="mt-4 font-display text-2xl font-bold text-neutral-950">
          Register your company
        </h1>
        <p className="mt-2 font-mono text-sm text-neutral-700">
          Takes about two minutes. An Admin verifies your domain before your
          profile goes live.
        </p>
        <div className="mt-6">
          <OnboardingForm />
        </div>
      </div>
    </div>
  );
}
