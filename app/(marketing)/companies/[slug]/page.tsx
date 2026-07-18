import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Globe, Link2, MapPin, Newspaper, Briefcase } from "lucide-react";

import { VerifiedBadge } from "@/components/shared/VerifiedBadge";
import { FundingChip } from "@/components/shared/FundingChip";
import { RemoteChip } from "@/components/shared/RemoteChip";
import { InternshipCard } from "@/components/shared/InternshipCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { BookmarkButton } from "@/features/bookmarks/components/BookmarkButton";
import { ProfileTabNav } from "@/components/shared/ProfileTabNav";
import { getCompanyBySlug } from "@/features/companies/queries";
import { getCurrentUser } from "@/lib/auth";
import { getBookmarkedIds } from "@/features/bookmarks/queries";

export const dynamic = "force-dynamic";

// lucide-react dropped brand/logo marks (no Github/Linkedin/Twitter icons) —
// every link renders with this generic mark; the type label carries the ID.
const LINK_ICONS: Record<string, typeof Globe> = {
  website: Globe,
};
const DEFAULT_LINK_ICON = Link2;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);
  if (!company) return {};
  return {
    title: company.name,
    description: company.tagline ?? undefined,
  };
}

export default async function CompanyProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);
  if (!company) notFound();

  let initialBookmarked = false;
  try {
    const user = await getCurrentUser();
    if (user) {
      const bookmarkedIds = await getBookmarkedIds(user.id, "COMPANY");
      initialBookmarked = bookmarkedIds.has(company.id);
    }
  } catch {
    // Anonymous or error → not bookmarked.
  }

  const founders = company.founders.filter((f) => !f.isHiringManager);
  const hiringManagers = company.founders.filter((f) => f.isHiringManager);

  return (
    <div className="mx-auto max-w-wide px-4 py-10 sm:px-6">
      {/* Hero */}
      <div className="flex flex-col gap-6 border-b-[3px] border-neutral-950 pb-8 sm:flex-row sm:items-start">
        {company.logoUrl ? (
          <Image
            src={company.logoUrl}
            alt=""
            width={80}
            height={80}
            className="size-20 shrink-0 rounded-[4px] border-[3px] border-neutral-950 bg-white object-contain p-2"
            priority
          />
        ) : (
          <div
            aria-hidden
            className="flex size-20 shrink-0 items-center justify-center rounded-[4px] border-[3px] border-neutral-950 bg-tile-lavender font-display text-3xl font-bold text-neutral-950"
          >
            {company.name.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-3xl font-bold text-neutral-950">{company.name}</h1>
            {company.verified && (
              <VerifiedBadge date={company.updatedAt} />
            )}
          </div>
          {company.tagline && (
            <p className="mt-1 text-body-lg text-muted-foreground">
              {company.tagline}
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {company.categories.map((c) => (
              <span
                key={c.id}
                className="inline-flex items-center rounded-sm border-[3px] border-neutral-950 bg-transparent px-2 py-0.5 text-[0.6875rem] font-bold uppercase tracking-[0.04em] text-foreground"
              >
                {c.name}
              </span>
            ))}
            {company.fundingStage && <FundingChip stage={company.fundingStage} />}
            {company.remotePolicy && <RemoteChip policy={company.remotePolicy} />}
            {company.employeeCountRange && (
              <span className="text-body-sm text-muted-foreground">
                {company.employeeCountRange} employees
              </span>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <BookmarkButton
            targetType="COMPANY"
            targetId={company.id}
            initialBookmarked={initialBookmarked}
          />
          {company.websiteUrl && (
            <Link
              href={company.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border-[3px] border-neutral-950 bg-card px-3 text-sm font-medium text-foreground shadow-brutal-xs transition-colors hover:bg-muted"
            >
              <Globe className="size-4" aria-hidden />
              Website
            </Link>
          )}
        </div>
      </div>

      <ProfileTabNav
        tabs={[
          ...(company.about ? [{ id: "about", label: "About" }] : []),
          ...(founders.length > 0 ? [{ id: "team", label: "Team" }] : []),
          ...(company.technologies.length > 0 ? [{ id: "tech", label: "Tech" }] : []),
          { id: "careers", label: `Careers (${company.openInternships.length})` },
          ...(company.news.length > 0 ? [{ id: "news", label: "News" }] : []),
        ]}
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
        {/* Main column */}
        <div className="min-w-0 space-y-10">
          {company.about && (
            <section id="about" className="scroll-mt-32">
              <h2 className="font-display text-xl font-bold text-neutral-950">About</h2>
              <div
                className="prose-verity mt-3 max-w-copy text-body text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: company.about }}
              />
            </section>
          )}

          {company.technologies.length > 0 && (
            <section id="tech" className="scroll-mt-32">
              <h2 className="font-display text-xl font-bold text-neutral-950">Tech stack</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {company.technologies.map((t) => (
                  <span
                    key={t.id}
                    className="rounded-sm border-[3px] border-neutral-950 bg-muted px-2 py-1 text-body-sm font-medium text-foreground"
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section id="careers" className="scroll-mt-32">
            <h2 className="font-display text-xl font-bold text-neutral-950">Open internships</h2>
            {company.openInternships.length > 0 ? (
              <div className="mt-3 space-y-3">
                {company.openInternships.map((internship) => (
                  <InternshipCard
                    key={internship.id}
                    internship={internship}
                    hideCompany
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Briefcase}
                title="No open roles right now"
                description={`${company.name} isn't hiring interns at the moment. Check back soon.`}
                compact
                className="mt-3"
              />
            )}
          </section>

          {company.news.length > 0 && (
            <section id="news" className="scroll-mt-32">
              <h2 className="font-display text-xl font-bold text-neutral-950">Recent news</h2>
              <ul className="mt-3 space-y-4">
                {company.news.map((item) => (
                  <li key={item.id} className="flex gap-3">
                    <Newspaper
                      className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    <div className="min-w-0">
                      {item.url ? (
                        <Link
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-body-sm font-medium text-foreground hover:underline"
                        >
                          {item.title}
                        </Link>
                      ) : (
                        <p className="text-body-sm font-medium text-foreground">
                          {item.title}
                        </p>
                      )}
                      <p className="text-caption text-muted-foreground">
                        {formatDate(item.publishedAt)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-8">
          {founders.length > 0 && (
            <section id="team" className="scroll-mt-32">
              <h2 className="font-display text-xl font-bold text-neutral-950">Founders</h2>
              <ul className="mt-3 space-y-3">
                {founders.map((f) => (
                  <li key={f.id} className="flex items-center gap-3">
                    <div
                      aria-hidden
                      className="flex size-9 shrink-0 items-center justify-center rounded-md border-[3px] border-neutral-950 bg-muted text-sm font-semibold text-muted-foreground"
                    >
                      {f.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-body-sm font-medium text-foreground">
                        {f.linkedinUrl ? (
                          <Link
                            href={f.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {f.name}
                          </Link>
                        ) : (
                          f.name
                        )}
                      </p>
                      {f.title && (
                        <p className="truncate text-caption text-muted-foreground">
                          {f.title}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {hiringManagers.length > 0 && (
            <section>
              <h2 className="text-overline text-muted-foreground">
                Hiring managers
              </h2>
              <ul className="mt-3 space-y-3">
                {hiringManagers.map((f) => (
                  <li key={f.id} className="flex items-center gap-3">
                    <div
                      aria-hidden
                      className="flex size-9 shrink-0 items-center justify-center rounded-md border-[3px] border-neutral-950 bg-muted text-sm font-semibold text-muted-foreground"
                    >
                      {f.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-body-sm font-medium text-foreground">
                        {f.linkedinUrl ? (
                          <Link
                            href={f.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {f.name}
                          </Link>
                        ) : (
                          f.name
                        )}
                      </p>
                      {f.title && (
                        <p className="truncate text-caption text-muted-foreground">
                          {f.title}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {company.locations.length > 0 && (
            <section>
              <h2 className="text-overline text-muted-foreground">Locations</h2>
              <ul className="mt-3 space-y-2">
                {company.locations.map((loc) => (
                  <li
                    key={loc.id}
                    className="flex items-center gap-2 text-body-sm text-foreground"
                  >
                    <MapPin className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                    {loc.city}, {loc.country}
                    {loc.isHQ && (
                      <span className="text-caption text-muted-foreground">(HQ)</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {company.links.length > 0 && (
            <section>
              <h2 className="text-overline text-muted-foreground">Links</h2>
              <ul className="mt-3 space-y-2">
                {company.links.map((link) => {
                  const Icon = LINK_ICONS[link.type] ?? DEFAULT_LINK_ICON;
                  return (
                    <li key={link.id}>
                      <Link
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-body-sm text-foreground hover:underline"
                      >
                        <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                        <span className="capitalize">{link.type}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
