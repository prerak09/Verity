import type { Metadata } from "next";

import { HelpCenterContent } from "@/components/shared/HelpCenterContent";

export const metadata: Metadata = {
  title: "Help Center",
};

export default function AdminHelpPage() {
  return (
    <div className="mx-auto max-w-wide px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-neutral-950">Help Center</h1>
      <p className="mt-1 text-body text-muted-foreground">
        Answers to common questions, or reach out to us directly.
      </p>
      <div className="mt-8">
        <HelpCenterContent />
      </div>
    </div>
  );
}
