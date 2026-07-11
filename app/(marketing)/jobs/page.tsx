import type { Metadata } from "next";
import { Armchair, Bell } from "lucide-react";

import { InternshipCard } from "@/components/shared/InternshipCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { InternshipsFilterBar } from "@/features/internships/components/InternshipsFilterBar";
import {
  listInternships,
  listInternshipLocations,
  listInternshipDepartments,
} from "@/features/internships/queries";
import type { InternshipCard as InternshipCardDTO, JobType, PageMeta, RemotePolicy } from "@/types";

export const metadata: Metadata = {
  title: "Jobs",
  description:
    "Full-time, part-time, and contract roles from manually verified startups on Verity.",
};

const PAGE_SIZE = 12;

export const dynamic = "force-dynamic";

interface JobsSearchParams {
  q?: string;
  location?: string;
  department?: string;
  jobType?: string;
  remotePolicy?: string;
  page?: string;
}

export default async function JobsListPage({
  searchParams,
}: {
  searchParams: Promise<JobsSearchParams>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  let internships: InternshipCardDTO[] = [];
  let meta: PageMeta = { page, pageSize: PAGE_SIZE, totalCount: 0, totalPages: 1 };
  let locations: string[] = [];
  let departments: string[] = [];
  try {
    const [result, locationOptions, departmentOptions] = await Promise.all([
      listInternships({
        page,
        pageSize: PAGE_SIZE,
        kind: "job",
        sort: "recent",
        q: params.q || undefined,
        location: params.location || undefined,
        department: params.department || undefined,
        jobType: (params.jobType as JobType) || undefined,
        remotePolicy: (params.remotePolicy as RemotePolicy) || undefined,
      }),
      listInternshipLocations(),
      listInternshipDepartments(),
    ]);
    internships = result.data;
    meta = result.meta;
    locations = locationOptions;
    departments = departmentOptions;
  } catch {
    // DB unreachable — fall through to empty state.
  }
  const totalCount = meta.totalCount;

  return (
    <div className="mx-auto max-w-wide px-4 py-12 sm:px-6">
      <div className="max-w-2xl">
        <span className="retro-eyebrow">Open Roles</span>
        <h1 className="mt-4 font-display text-4xl font-bold text-neutral-950">Jobs</h1>
        <p className="mt-2 font-mono text-sm text-neutral-700">
          {totalCount} open {totalCount === 1 ? "job" : "jobs"} from verified startups —
          full-time, part-time, and contract.
        </p>
      </div>

      <InternshipsFilterBar
        locations={locations}
        departments={departments}
        variant="job"
      />

      {internships.length === 0 ? (
        <EmptyState
          icon={Armchair}
          title="No jobs available right now"
          description="We don't have any open positions at the moment. Please check back later — new opportunities are added every day!"
          action={{ label: "Get notified when new jobs are posted", href: "/sign-up", icon: Bell }}
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
            href={(p) => {
              const next = new URLSearchParams();
              for (const [k, v] of Object.entries(params)) {
                if (v && k !== "page") next.set(k, v);
              }
              next.set("page", String(p));
              return `/jobs?${next.toString()}`;
            }}
            className="mt-10"
          />
        </>
      )}
    </div>
  );
}
