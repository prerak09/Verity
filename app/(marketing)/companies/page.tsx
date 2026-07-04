import type { Metadata } from "next";
import { Building2 } from "lucide-react";

import { CompanyCard } from "@/components/shared/CompanyCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { MOCK_COMPANIES } from "@/components/lib/mocks";
import type { PageMeta } from "@/types";

export const metadata: Metadata = {
  title: "Companies",
  description:
    "Every company on Verity is manually verified — funding, founders, remote policy, and open internships in one place.",
};

const PAGE_SIZE = 12;

export default async function CompaniesDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const totalCount = MOCK_COMPANIES.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const companies = MOCK_COMPANIES.slice(start, start + PAGE_SIZE);

  const meta: PageMeta = { page, pageSize: PAGE_SIZE, totalCount, totalPages };

  return (
    <div className="mx-auto max-w-wide px-4 py-12 sm:px-6">
      <div className="max-w-2xl">
        <p className="text-overline text-brand-700">DIRECTORY</p>
        <h1 className="mt-2 text-h1 text-foreground">Companies</h1>
        <p className="mt-2 text-body text-muted-foreground">
          {totalCount} companies, every one manually verified before it goes
          live.
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
