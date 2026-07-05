import type { Metadata } from "next";
import { Briefcase } from "lucide-react";

import { InternshipCard } from "@/components/shared/InternshipCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { MOCK_INTERNSHIPS } from "@/components/lib/mocks";
import type { PageMeta } from "@/types";

export const metadata: Metadata = {
  title: "Internships",
  description:
    "Every open internship on Verity, from manually verified companies.",
};

const PAGE_SIZE = 12;

export default async function InternshipsListPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const openInternships = MOCK_INTERNSHIPS.filter(
    (i) => i.status === "PUBLISHED",
  );
  const totalCount = openInternships.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const internships = openInternships.slice(start, start + PAGE_SIZE);

  const meta: PageMeta = { page, pageSize: PAGE_SIZE, totalCount, totalPages };

  return (
    <div className="mx-auto max-w-wide px-4 py-12 sm:px-6">
      <div className="max-w-2xl">
        <span className="retro-eyebrow">Open Roles</span>
        <h1 className="mt-4 font-display text-4xl font-bold text-neutral-950">Internships</h1>
        <p className="mt-2 font-mono text-sm text-neutral-700">
          {totalCount} open internships from verified companies.
        </p>
      </div>

      {internships.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No open internships right now"
          description="Check back soon, or browse verified companies instead."
          action={{ label: "Browse companies", href: "/companies" }}
          className="mt-8"
        />
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {internships.map((internship) => (
              <InternshipCard key={internship.id} internship={internship} />
            ))}
          </div>
          <Pagination
            meta={meta}
            href={(p) => `/internships?page=${p}`}
            className="mt-10"
          />
        </>
      )}
    </div>
  );
}
