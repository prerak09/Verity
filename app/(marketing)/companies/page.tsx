import type { Metadata } from "next";
import { Building2 } from "lucide-react";

import { CompanyCard } from "@/components/shared/CompanyCard";
import { CompanyListRow } from "@/components/shared/CompanyListRow";
import { EmptyState } from "@/components/shared/EmptyState";
import { MobileFilterSheet } from "@/components/shared/MobileFilterSheet";
import { Pagination } from "@/components/shared/Pagination";
import { BookmarkButton } from "@/features/bookmarks/components/BookmarkButton";
import { CompaniesFilterBar } from "@/features/companies/components/CompaniesFilterBar";
import { CompaniesFilterSidebar } from "@/features/companies/components/CompaniesFilterSidebar";
import { listCompanies, listCompanyLocations, listCategories } from "@/features/companies/queries";
import { getBookmarkedIds } from "@/features/bookmarks/queries";
import { getCurrentUser } from "@/lib/auth";
import type {
  CompanyCard as CompanyCardDTO,
  CompanyFilters,
  PageMeta,
  TaxonomyRef,
} from "@/types";

export const metadata: Metadata = {
  title: "Companies",
  description:
    "Every company on Verity is manually verified — funding, founders, remote policy, and open internships in one place.",
};

const PAGE_SIZE = 12;

export const dynamic = "force-dynamic";

interface CompaniesSearchParams {
  q?: string;
  category?: string;
  location?: string;
  stage?: string;
  hiring?: string;
  sort?: string;
  view?: string;
  page?: string;
}

export default async function CompaniesDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<CompaniesSearchParams>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const view = params.view === "list" ? "list" : "grid";

  let companies: CompanyCardDTO[] = [];
  let meta: PageMeta = { page, pageSize: PAGE_SIZE, totalCount: 0, totalPages: 1 };
  let locations: string[] = [];
  let categories: TaxonomyRef[] = [];
  let bookmarkedIds = new Set<string>();
  let canBookmark = false;

  try {
    const user = await getCurrentUser();
    canBookmark = user?.role === "STUDENT";

    const [result, locationOptions, categoryOptions, bookmarks] = await Promise.all([
      listCompanies({
        page,
        pageSize: PAGE_SIZE,
        sort: (params.sort as CompanyFilters["sort"]) || "relevance",
        q: params.q || undefined,
        category: params.category || undefined,
        location: params.location || undefined,
        fundingStage: (params.stage as CompanyFilters["fundingStage"]) || undefined,
        hiringNow: params.hiring === "true" || undefined,
      }),
      listCompanyLocations(),
      listCategories(),
      canBookmark ? getBookmarkedIds(user!.id, "COMPANY") : Promise.resolve(new Set<string>()),
    ]);
    companies = result.data;
    meta = result.meta;
    locations = locationOptions;
    categories = categoryOptions;
    bookmarkedIds = bookmarks;
  } catch {
    // DB unreachable — render the empty state instead of a hard 500.
  }
  const totalCount = meta.totalCount;
  const rangeStart = totalCount === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, totalCount);

  function buildHref(p: number) {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v && k !== "page") next.set(k, v);
    }
    next.set("page", String(p));
    return `/companies?${next.toString()}`;
  }

  return (
    <div className="mx-auto max-w-wide px-4 py-12 sm:px-6">
      <div className="max-w-2xl">
        <span className="retro-eyebrow">Directory</span>
        <h1 className="mt-4 font-display text-4xl font-bold text-neutral-950">
          Browse Startups
        </h1>
        <p className="mt-2 font-mono text-sm text-neutral-700">
          Discover verified startups and explore exciting opportunities.
        </p>
      </div>

      <CompaniesFilterBar view={view} />

      <div className="mt-6 grid gap-8 lg:grid-cols-[288px_1fr]">
        <div className="hidden lg:block">
          <CompaniesFilterSidebar categories={categories} locations={locations} />
        </div>
        <MobileFilterSheet>
          <CompaniesFilterSidebar categories={categories} locations={locations} />
        </MobileFilterSheet>

        <div className="min-w-0">
          <p className="text-body-sm text-muted-foreground">
            {totalCount === 0
              ? "No startups found"
              : `Showing ${rangeStart} – ${rangeEnd} of ${totalCount} startups`}
          </p>

          {companies.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No companies match"
              description="Try fewer filters, or check back soon as new startups get verified."
              className="mt-8"
            />
          ) : (
            <>
              {view === "grid" ? (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {companies.map((company) => (
                    <CompanyCard
                      key={company.id}
                      company={company}
                      bookmarkSlot={
                        canBookmark ? (
                          <BookmarkButton
                            targetType="COMPANY"
                            targetId={company.id}
                            initialBookmarked={bookmarkedIds.has(company.id)}
                          />
                        ) : undefined
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {companies.map((company) => (
                    <CompanyListRow
                      key={company.id}
                      company={company}
                      bookmarkSlot={
                        canBookmark ? (
                          <BookmarkButton
                            targetType="COMPANY"
                            targetId={company.id}
                            initialBookmarked={bookmarkedIds.has(company.id)}
                          />
                        ) : undefined
                      }
                    />
                  ))}
                </div>
              )}
              <Pagination meta={meta} href={buildHref} className="mt-10" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
