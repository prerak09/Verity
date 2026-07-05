import type { Metadata } from "next";
import { Building2 } from "lucide-react";

import { CompanyCard } from "@/components/shared/CompanyCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { listCompanies } from "@/features/companies/queries";
import type { CompanyCard as CompanyCardDTO, PageMeta } from "@/types";

export const metadata: Metadata = {
  title: "Companies",
  description:
    "Every company on Verity is manually verified — funding, founders, remote policy, and open internships in one place.",
};

const PAGE_SIZE = 12;

export const dynamic = "force-dynamic";

export default async function CompaniesDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  let companies: CompanyCardDTO[] = [];
  let meta: PageMeta = { page, pageSize: PAGE_SIZE, totalCount: 0, totalPages: 1 };
  try {
    const result = await listCompanies({ page, pageSize: PAGE_SIZE, sort: "recent" });
    companies = result.data;
    meta = result.meta;
  } catch {
    // DB unreachable — render the empty state instead of a hard 500.
  }
  const totalCount = meta.totalCount;

  return (
    <div className="mx-auto max-w-wide px-4 py-12 sm:px-6">
      <div className="max-w-2xl">
        <span className="retro-eyebrow">Directory</span>
        <h1 className="mt-4 font-display text-4xl font-bold text-neutral-950">
          Browse Startups
        </h1>
        <p className="mt-2 font-mono text-sm text-neutral-700">
          {totalCount} verified startups. Discover and explore exciting
          opportunities.
        </p>
      </div>

      {companies.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No companies yet"
          description="Check back soon, or suggest a company you'd like to see verified."
          className="mt-8"
        />
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {companies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
          <Pagination
            meta={meta}
            href={(p) => `/companies?page=${p}`}
            className="mt-10"
          />
        </>
      )}
    </div>
  );
}
