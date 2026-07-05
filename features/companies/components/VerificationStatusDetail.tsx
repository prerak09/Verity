import Link from "next/link";
import { ShieldAlert, ShieldCheck, ShieldX, Clock, Check, X } from "lucide-react";

import type { CompanyDetail, VerificationStatus } from "@/types";
import { REQUIRED_FOR_VERIFICATION } from "@/features/companies/schema";
import { Button } from "@/components/ui/button";

const FIELD_LABEL: Record<(typeof REQUIRED_FOR_VERIFICATION)[number] | "locations", string> = {
  name: "Company name",
  tagline: "Tagline",
  about: "About",
  logoUrl: "Logo",
  websiteUrl: "Website",
  remotePolicy: "Remote policy",
  employeeCountRange: "Employee count",
  locations: "At least one location",
};

const CONFIG: Record<
  VerificationStatus,
  { icon: typeof ShieldAlert; tone: "warning" | "info" | "error" | "success"; title: string; description: string }
> = {
  UNVERIFIED: {
    icon: ShieldAlert,
    tone: "warning",
    title: "Not yet submitted",
    description: "Complete the required fields below, then submit your profile for Admin review.",
  },
  PENDING: {
    icon: Clock,
    tone: "info",
    title: "Verification in progress",
    description: "An Admin is reviewing your submission — this usually takes a couple of business days.",
  },
  REJECTED: {
    icon: ShieldX,
    tone: "error",
    title: "Changes requested",
    description: "An Admin flagged something to fix before your profile can go live.",
  },
  VERIFIED: {
    icon: ShieldCheck,
    tone: "success",
    title: "Verified",
    description: "Your profile is live and visible to students.",
  },
};

const TONE_CLASSES = {
  warning: "border-warning-border bg-warning-bg text-warning-fg",
  info: "border-info-border bg-info-bg text-info-fg",
  error: "border-error-border bg-error-bg text-error-fg",
  success: "border-success-border bg-success-bg text-success-fg",
};

/**
 * `CompanyDetail` doesn't expose the Admin's `rejectionReason` text yet
 * (it exists in the DB and the Admin-facing verification queue DTO, but
 * isn't threaded through to the company-facing contract) — requested via
 * CONTRACTS.md CR-11. `reason` is left undefined until then.
 */
function getMissingFields(company: CompanyDetail): string[] {
  const values: Record<string, unknown> = {
    name: company.name,
    tagline: company.tagline,
    about: company.about,
    logoUrl: company.logoUrl,
    websiteUrl: company.websiteUrl,
    remotePolicy: company.remotePolicy,
    employeeCountRange: company.employeeCountRange,
  };
  const missing = REQUIRED_FOR_VERIFICATION.filter((f) => {
    const v = values[f];
    return v === null || v === undefined || v === "";
  }) as string[];
  if (company.locations.length === 0) missing.push("locations");
  return missing;
}

export function VerificationStatusDetail({
  company,
  reason,
}: {
  company: CompanyDetail;
  reason?: string | null;
}) {
  const status = company.verificationStatus;
  const config = CONFIG[status];
  const Icon = config.icon;
  const missing = getMissingFields(company);
  const showChecklist = status === "UNVERIFIED" || status === "REJECTED";

  return (
    <div className="space-y-4">
      <div className={`rounded-[4px] border-2 p-5 ${TONE_CLASSES[config.tone]}`}>
        <div className="flex items-center gap-3">
          <Icon className="size-6 shrink-0" strokeWidth={1.75} aria-hidden />
          <div>
            <p className="font-semibold">{config.title}</p>
            <p className="mt-0.5 text-body-sm opacity-90">{config.description}</p>
          </div>
        </div>
        {status === "REJECTED" && (
          <p className="mt-3 rounded-lg border border-current/20 bg-background/40 p-3 text-body-sm">
            {reason ?? "No reason text is available — check with your Admin contact for details."}
          </p>
        )}
      </div>

      {showChecklist && (
        <div className="rounded-[4px] border-[3px] border-neutral-950 bg-card p-5 shadow-brutal-sm">
          <h2 className="text-h4 text-foreground">What to fix</h2>
          <ul className="mt-3 space-y-2">
            {(Object.keys(FIELD_LABEL) as (keyof typeof FIELD_LABEL)[]).map((field) => {
              const isMissing = missing.includes(field);
              return (
                <li key={field} className="flex items-center gap-2 text-body-sm">
                  {isMissing ? (
                    <X className="size-4 shrink-0 text-error-fg" aria-hidden />
                  ) : (
                    <Check className="size-4 shrink-0 text-success-fg" aria-hidden />
                  )}
                  <span className={isMissing ? "text-foreground" : "text-muted-foreground line-through"}>
                    {FIELD_LABEL[field]}
                  </span>
                </li>
              );
            })}
          </ul>
          <Button size="sm" variant="outline" className="mt-4" render={<Link href="/company/profile" />}>
            {missing.length > 0 ? "Complete your profile" : "Review your profile"}
          </Button>
        </div>
      )}
    </div>
  );
}
