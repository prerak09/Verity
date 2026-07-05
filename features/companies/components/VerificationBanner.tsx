import Link from "next/link";
import { ShieldAlert, Clock, ShieldX } from "lucide-react";

import type { VerificationStatus } from "@/types";
import { Button } from "@/components/ui/button";

const CONFIG: Record<
  Exclude<VerificationStatus, "VERIFIED">,
  {
    icon: typeof ShieldAlert;
    tone: "warning" | "info" | "error";
    title: string;
    description: string;
    cta?: { label: string; href: string };
  }
> = {
  UNVERIFIED: {
    icon: ShieldAlert,
    tone: "warning",
    title: "Your profile isn't verified yet",
    description:
      "Complete the required fields on your profile, then submit for Admin review.",
    cta: { label: "Complete your profile", href: "/company/profile" },
  },
  PENDING: {
    icon: Clock,
    tone: "info",
    title: "Verification in progress",
    description:
      "An Admin is reviewing your submission — this usually takes a couple of business days.",
  },
  REJECTED: {
    icon: ShieldX,
    tone: "error",
    title: "Changes requested",
    description:
      "An Admin flagged something to fix before your profile can go live. Check your profile for details.",
    cta: { label: "Review your profile", href: "/company/profile" },
  },
};

const TONE_CLASSES = {
  warning: "border-warning-border bg-warning-bg text-warning-fg",
  info: "border-info-border bg-info-bg text-info-fg",
  error: "border-error-border bg-error-bg text-error-fg",
};

/**
 * Persistent while not fully Verified (doc §15.2 module 1); disappears
 * entirely once VERIFIED. 4.10 extends this with the "what to fix"
 * checklist for REJECTED/UNVERIFIED — this is the dashboard summary form.
 */
export function VerificationBanner({ status }: { status: VerificationStatus }) {
  if (status === "VERIFIED") return null;

  const config = CONFIG[status];
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-4 rounded-xl border-2 p-4 ${TONE_CLASSES[config.tone]}`}>
      <Icon className="size-6 shrink-0" strokeWidth={1.75} aria-hidden />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{config.title}</p>
        <p className="mt-0.5 text-body-sm opacity-90">{config.description}</p>
      </div>
      {config.cta && (
        <Button size="sm" variant="outline" render={<Link href={config.cta.href} />}>
          {config.cta.label}
        </Button>
      )}
    </div>
  );
}
