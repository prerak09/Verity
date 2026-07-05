import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, MapPin, Clock } from "lucide-react";

import { RemoteChip } from "@/components/shared/RemoteChip";
import { Button } from "@/components/ui/button";
import { BookmarkButton } from "@/features/bookmarks/components/BookmarkButton";
import { MOCK_INTERNSHIP_DETAILS, MOCK_BOOKMARKS } from "@/components/lib/mocks";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const internship = MOCK_INTERNSHIP_DETAILS[slug];
  if (!internship) return {};
  return {
    title: `${internship.title} at ${internship.companyName}`,
    description: internship.description.replace(/<[^>]+>/g, "").slice(0, 160),
  };
}

const STATUS_LABEL: Record<string, string> = {
  PUBLISHED: "Open",
  DRAFT: "Draft",
  ARCHIVED: "Closed",
};

export default async function InternshipDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const internship = MOCK_INTERNSHIP_DETAILS[slug];
  if (!internship) notFound();

  return (
    <div className="mx-auto max-w-wide px-4 py-10 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-sm border-[3px] border-neutral-950 bg-success-bg px-2 py-0.5 text-[0.6875rem] font-bold uppercase tracking-[0.04em] text-success-fg">
                {STATUS_LABEL[internship.status] ?? internship.status}
              </span>
              {internship.isStale && (
                <span className="inline-flex items-center rounded-sm border-2 border-warning-border bg-warning-bg px-2 py-0.5 text-[0.6875rem] font-bold uppercase tracking-[0.04em] text-warning-fg">
                  Still open?
                </span>
              )}
            </div>
            <BookmarkButton
              targetType="INTERNSHIP"
              targetId={internship.id}
              initialBookmarked={MOCK_BOOKMARKS.some(
                (b) => b.internship?.slug === internship.slug,
              )}
            />
          </div>

          <h1 className="mt-3 font-display text-3xl font-bold text-neutral-950">{internship.title}</h1>

          <Link
            href={`/companies/${internship.companySlug}`}
            className="mt-2 inline-flex items-center gap-2 text-body font-medium text-foreground hover:underline"
          >
            {internship.companyLogoUrl ? (
              <Image
                src={internship.companyLogoUrl}
                alt=""
                width={24}
                height={24}
                className="size-6 shrink-0 rounded-sm border-[3px] border-neutral-950 object-cover"
              />
            ) : (
              <span
                aria-hidden
                className="flex size-6 shrink-0 items-center justify-center rounded-sm border-[3px] border-neutral-950 bg-muted text-xs font-semibold text-muted-foreground"
              >
                {internship.companyName.charAt(0)}
              </span>
            )}
            {internship.companyName}
          </Link>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-body-sm text-muted-foreground">
            {internship.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-4" aria-hidden />
                {internship.location}
              </span>
            )}
            {internship.remotePolicy && <RemoteChip policy={internship.remotePolicy} />}
            {internship.duration && (
              <span className="inline-flex items-center gap-1">
                <Clock className="size-4" aria-hidden />
                {internship.duration}
              </span>
            )}
            {internship.stipend && (
              <span className="font-medium text-foreground">{internship.stipend}</span>
            )}
          </div>

          <div className="mt-8 border-t-2 border-border pt-8">
            <h2 className="font-display text-xl font-bold text-neutral-950">About this role</h2>
            <div
              className="prose-verity mt-3 max-w-copy text-body text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: internship.description }}
            />
          </div>
        </div>

        {/* Apply CTA — external deep-link only, no in-app application form (FR-25) */}
        <aside>
          <div className="sticky top-24 rounded-[4px] border-[3px] border-neutral-950 bg-card p-5 shadow-brutal-md">
            <p className="text-overline text-muted-foreground">Ready to apply?</p>
            <p className="mt-1 text-body-sm text-muted-foreground">
              Applications are handled on {internship.companyName}&apos;s own
              site — Verity doesn&apos;t collect applications directly.
            </p>
            <Button
              className="mt-4 w-full"
              size="lg"
              render={
                <Link
                  href={internship.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              Apply on company site
              <ExternalLink className="size-4" aria-hidden />
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
