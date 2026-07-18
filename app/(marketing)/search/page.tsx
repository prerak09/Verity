import type { Metadata } from "next";
import Link from "next/link";
import { Search, SearchX, X as XIcon } from "lucide-react";

import { CompanyCard } from "@/components/shared/CompanyCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { MobileFilterSheet } from "@/components/shared/MobileFilterSheet";
import { Pagination } from "@/components/shared/Pagination";
import { listCompanies, listCategories } from "@/features/companies/queries";
import { listTechnologies } from "@/features/admin/taxonomy";
import type {
  CompanyCard as CompanyCardDTO,
  FundingStage,
  FundingStageFilter,
  PageMeta,
  RemotePolicy,
  TaxonomyRef,
} from "@/types";

export const metadata: Metadata = {
  title: "Search",
  description: "Search verified companies by category, technology, funding stage, and more.",
};

export const dynamic = "force-dynamic";

const FUNDING_STAGES: { value: FundingStage; label: string }[] = [
  { value: "BOOTSTRAPPED", label: "Bootstrapped" },
  { value: "PRE_SEED", label: "Pre-seed" },
  { value: "SEED", label: "Seed" },
  { value: "SERIES_A", label: "Series A" },
  { value: "SERIES_B", label: "Series B" },
  { value: "SERIES_C_PLUS", label: "Series C+" },
  { value: "PUBLIC", label: "Public" },
];

const REMOTE_POLICIES: { value: RemotePolicy; label: string }[] = [
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "ONSITE", label: "Onsite" },
];

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "recent", label: "Recently added" },
  { value: "trending", label: "Trending" },
  { value: "name", label: "Alphabetical" },
];

const PAGE_SIZE = 9;

interface SearchParams {
  q?: string;
  category?: string;
  technology?: string;
  fundingStage?: string;
  remotePolicy?: string;
  visaSponsorship?: string;
  location?: string;
  sort?: string;
  page?: string;
}

/** Builds the href for toggling one filter param — clears it if already active. */
function filterHref(
  current: SearchParams,
  key: keyof SearchParams,
  value: string,
): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(current)) {
    if (v && k !== "page") params.set(k, v);
  }
  if (current[key] === value) {
    params.delete(key);
  } else {
    params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `/search?${qs}` : "/search";
}

function FilterPill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={
        active
          ? "inline-flex items-center gap-1 rounded-sm border-[3px] border-neutral-950 bg-tile-lavender px-2 py-1 text-body-sm font-medium text-brand-800 shadow-brutal-xs"
          : "inline-flex items-center gap-1 rounded-sm border-2 border-transparent bg-muted px-2 py-1 text-body-sm font-medium text-foreground hover:border-border"
      }
    >
      {children}
      {active && <XIcon className="size-3" aria-hidden />}
    </Link>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const {
    q,
    category,
    technology,
    fundingStage,
    remotePolicy,
    visaSponsorship,
    location,
    sort,
  } = params;
  const page = Math.max(1, Number(params.page) || 1);

  const sortParam: "recent" | "trending" | "name" | undefined =
    sort === "recent" || sort === "trending" || sort === "name" ? sort : undefined;

  let pageResults: CompanyCardDTO[] = [];
  let meta: PageMeta = { page, pageSize: PAGE_SIZE, totalCount: 0, totalPages: 1 };
  let categories: TaxonomyRef[] = [];
  let technologies: TaxonomyRef[] = [];

  try {
    const [result, cats, techs] = await Promise.all([
      listCompanies({
        page,
        pageSize: PAGE_SIZE,
        q: q || undefined,
        category: category || undefined,
        technology: technology || undefined,
        fundingStage: (fundingStage as FundingStageFilter) || undefined,
        remotePolicy: (remotePolicy as RemotePolicy) || undefined,
        visaSponsorship:
          visaSponsorship === "true"
            ? true
            : visaSponsorship === "false"
              ? false
              : undefined,
        location: location || undefined,
        sort: sortParam,
      }),
      listCategories(),
      listTechnologies(),
    ]);
    pageResults = result.data;
    meta = result.meta;
    categories = cats;
    technologies = techs;
  } catch {
    // DB unreachable — render the empty state below.
  }

  const totalCount = meta.totalCount;
  const hasActiveFilters = Boolean(
    category || technology || fundingStage || remotePolicy || visaSponsorship || location,
  );

  const filterSidebarContent = (
    <div className="space-y-6">
      <div>
        <h2 className="text-overline text-muted-foreground">Category</h2>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <FilterPill
              key={c.id}
              href={filterHref(params, "category", c.slug)}
              active={category === c.slug}
            >
              {c.name}
            </FilterPill>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-overline text-muted-foreground">Technology</h2>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {technologies.map((t) => (
            <FilterPill
              key={t.id}
              href={filterHref(params, "technology", t.slug)}
              active={technology === t.slug}
            >
              {t.name}
            </FilterPill>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-overline text-muted-foreground">Funding stage</h2>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {FUNDING_STAGES.map((f) => (
            <FilterPill
              key={f.value}
              href={filterHref(params, "fundingStage", f.value)}
              active={fundingStage === f.value}
            >
              {f.label}
            </FilterPill>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-overline text-muted-foreground">Remote policy</h2>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {REMOTE_POLICIES.map((r) => (
            <FilterPill
              key={r.value}
              href={filterHref(params, "remotePolicy", r.value)}
              active={remotePolicy === r.value}
            >
              {r.label}
            </FilterPill>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-overline text-muted-foreground">Visa sponsorship</h2>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <FilterPill
            href={filterHref(params, "visaSponsorship", "true")}
            active={visaSponsorship === "true"}
          >
            Yes
          </FilterPill>
          <FilterPill
            href={filterHref(params, "visaSponsorship", "false")}
            active={visaSponsorship === "false"}
          >
            No
          </FilterPill>
        </div>
      </div>

      {hasActiveFilters && (
        <Link href={q ? `/search?q=${encodeURIComponent(q)}` : "/search"} className="text-body-sm font-medium text-foreground hover:underline">
          Clear all filters
        </Link>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-wide px-4 py-10 sm:px-6">
      <form action="/search" method="get" className="max-w-lg">
        <div className="flex h-11 items-center gap-2 rounded-md border-[3px] border-neutral-950 bg-card px-3 shadow-brutal-xs">
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <input
            type="search"
            name="q"
            aria-label="Search companies, categories, tech"
            defaultValue={q ?? ""}
            placeholder="Search companies, categories, tech…"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </form>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[288px_1fr]">
        {/* Filter sidebar */}
        <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
          {filterSidebarContent}
        </aside>
        <MobileFilterSheet>{filterSidebarContent}</MobileFilterSheet>

        {/* Results */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-body-sm text-muted-foreground">
              {totalCount} {totalCount === 1 ? "company" : "companies"}
            </p>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-body-sm text-muted-foreground">Sort:</span>
              {SORT_OPTIONS.map((opt) => (
                <FilterPill
                  key={opt.value}
                  href={filterHref(params, "sort", opt.value)}
                  active={sort === opt.value}
                >
                  {opt.label}
                </FilterPill>
              ))}
            </div>
          </div>

          {pageResults.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No companies match"
              description="Try fewer filters, or tell us who to add next."
              action={{ label: "Browse categories", href: "/companies" }}
              secondaryAction={{ label: "Suggest a company", href: "/companies" }}
              className="mt-8"
            />
          ) : (
            <>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {pageResults.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
              <Pagination
                meta={meta}
                href={(p) => {
                  const next = new URLSearchParams();
                  for (const [k, v] of Object.entries(params)) {
                    if (v) next.set(k, v);
                  }
                  next.set("page", String(p));
                  return `/search?${next.toString()}`;
                }}
                className="mt-10"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
