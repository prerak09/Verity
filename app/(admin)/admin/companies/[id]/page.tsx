import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Briefcase } from "lucide-react";

import { getAdminCompanyById } from "@/features/admin/companies";
import { InternshipManager } from "@/features/internships/components/InternshipManager";
import { VerifiedBadge } from "@/components/shared/VerifiedBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Manage company" };
export const dynamic = "force-dynamic";

export default async function AdminCompanyEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getAdminCompanyById(id);
  if (!result) notFound();
  const { company, internships } = result;

  return (
    <div className="mx-auto max-w-wide px-4 py-8 sm:px-6">
      <Link
        href="/admin/companies"
        className="inline-flex items-center gap-1.5 font-mono text-sm font-bold text-neutral-700 hover:text-neutral-950"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to companies
      </Link>

      {/* Company header */}
      <div className="mt-4 flex flex-col gap-4 rounded-[4px] border-[3px] border-neutral-950 bg-card p-5 [box-shadow:4px_4px_0_0_var(--color-neutral-950)] sm:flex-row sm:items-center">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-[3px] border-[3px] border-neutral-950 bg-tile-lavender font-display text-2xl font-bold text-neutral-950">
          {company.name.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-bold text-neutral-950">{company.name}</h1>
            {company.verified && <VerifiedBadge size="sm" />}
            <Badge variant={company.verified ? "success" : "outline"}>
              {company.verificationStatus}
            </Badge>
          </div>
          {company.tagline && (
            <p className="mt-1 font-mono text-sm text-neutral-700">{company.tagline}</p>
          )}
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            variant="outline"
            size="sm"
            render={<Link href={`/companies/${company.slug}`} target="_blank" />}
          >
            View public page <ExternalLink className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Internships & jobs for THIS company */}
      <section className="mt-8">
        <div className="flex items-center gap-2">
          <Briefcase className="size-5 text-neutral-950" aria-hidden />
          <h2 className="font-display text-xl font-bold text-neutral-950">
            Internships &amp; jobs
          </h2>
        </div>
        <p className="mt-1 font-mono text-sm text-neutral-600">
          Listings you add here appear on {company.name}&apos;s profile and in the
          public jobs feed once published.
        </p>
        <div className="mt-4">
          <InternshipManager
            companyId={company.id}
            companyVerificationStatus={company.verificationStatus}
            initialInternships={internships}
          />
        </div>
      </section>
    </div>
  );
}
