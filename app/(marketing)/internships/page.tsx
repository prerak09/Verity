import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";

import { InternshipCard } from "@/components/shared/InternshipCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/Pagination";
import { InternshipsFilterBar } from "@/features/internships/components/InternshipsFilterBar";
import {
  listInternships,
  listInternshipLocations,
  listInternshipDepartments,
} from "@/features/internships/queries";
import type { InternshipCard as InternshipCardDTO, PageMeta, RemotePolicy, Season } from "@/types";

export const metadata: Metadata = {
  title: "Internships",
  description:
    "Every open internship from manually verified startups on Verity, sortable by season.",
};

const PAGE_SIZE = 12;

export const dynamic = "force-dynamic";

interface InternshipsSearchParams {
  q?: string;
  location?: string;
  department?: string;
  season?: string;
  remotePolicy?: string;
  sort?: string;
  page?: string;
}

function parseSort(v: string | undefined): "recent" | "title" | "season" {
  return v === "title" || v === "season" ? v : "recent";
}

export default async function InternshipsListPage({
  searchParams,
}: {
  searchParams: Promise<InternshipsSearchParams>;
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
        kind: "internship",
        sort: parseSort(params.sort),
        q: params.q || undefined,
        location: params.location || undefined,
        department: params.department || undefined,
        season: (params.season as Season) || undefined,
        remotePolicy: (params.remotePolicy as RemotePolicy) || undefined,
      }),
      listInternshipLocations("internship"),
      listInternshipDepartments("internship"),
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
        <span className="retro-eyebrow">Internships</span>
        <h1 className="mt-4 font-display text-4xl font-bold text-neutral-950">Internships</h1>
        <p className="mt-2 font-mono text-sm text-neutral-700">
          {totalCount} open {totalCount === 1 ? "internship" : "internships"} from verified startups
          — filter by season.
        </p>
      </div>

      <InternshipsFilterBar
        locations={locations}
        departments={departments}
        variant="internship"
      />

      {internships.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No internships available right now"
          description="No open internships match right now. Explore verified startups, or check back soon — new roles are added regularly."
          action={{ label: "Browse startups", href: "/companies" }}
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
              return `/internships?${next.toString()}`;
            }}
            className="mt-10"
          />
        </>
      )}
    </div>
  );
}
