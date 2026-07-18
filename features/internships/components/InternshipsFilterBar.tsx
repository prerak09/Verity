"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/components/lib/utils";
import type { JobType, RemotePolicy } from "@/types";
import { SEASON_OPTIONS } from "@/config/seasons";

const ALL = "all";

// Jobs and Women pages only — internships are split out into their own /internships surface.
const JOB_TYPES: { value: JobType; label: string }[] = [
  { value: "FULL_TIME", label: "Full-time" },
  { value: "PART_TIME", label: "Part-time" },
  { value: "CONTRACT", label: "Contract" },
];

const SEASONS = SEASON_OPTIONS;

const REMOTE_POLICIES: { value: RemotePolicy; label: string }[] = [
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
  { value: "ONSITE", label: "Onsite" },
];

const selectTriggerClass =
  "h-11 w-full rounded-md border-[3px] border-neutral-950 bg-card px-3 text-sm shadow-brutal-xs sm:w-44";

export function InternshipsFilterBar({
  locations,
  departments,
  variant = "internship",
}: {
  locations: string[];
  departments: string[];
  /** "internship" surfaces a Season filter; "job"/"women" surface a Job Type filter. */
  variant?: "internship" | "job" | "women";
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showMore, setShowMore] = useState(Boolean(searchParams.get("remotePolicy")));
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== ALL) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    const qs = params.toString();
    const href = qs ? `${pathname}?${qs}` : pathname;
    startTransition(() => router.push(href));
  }

  function handleSearchChange(value: string) {
    setQ(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParam("q", value || null), 250);
  }

  const location = searchParams.get("location") ?? ALL;
  const department = searchParams.get("department") ?? ALL;
  const jobType = searchParams.get("jobType") ?? ALL;
  const season = searchParams.get("season") ?? ALL;
  const remotePolicy = searchParams.get("remotePolicy") ?? ALL;
  const sort = searchParams.get("sort") ?? "recent";

  // Internships can additionally sort by season; jobs cannot.
  const sortOptions =
    variant === "internship"
      ? [
          { value: "recent", label: "Most recent" },
          { value: "title", label: "Title (A–Z)" },
          { value: "season", label: "By season" },
        ]
      : [
          { value: "recent", label: "Most recent" },
          { value: "title", label: "Title (A–Z)" },
        ];

  const locationSelect = (
    <Select value={location} onValueChange={(v) => updateParam("location", v)}>
      <SelectTrigger className={selectTriggerClass}>
        <SelectValue>{(v: string) => (v === ALL ? "All Locations" : v)}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>All Locations</SelectItem>
        {locations.map((loc) => (
          <SelectItem key={loc} value={loc}>
            {loc}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const departmentSelect = (
    <Select value={department} onValueChange={(v) => updateParam("department", v)}>
      <SelectTrigger className={selectTriggerClass}>
        <SelectValue>{(v: string) => (v === ALL ? "All Departments" : v)}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>All Departments</SelectItem>
        {departments.map((dept) => (
          <SelectItem key={dept} value={dept}>
            {dept}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const jobTypeOrSeasonSelect =
    variant === "job" || variant === "women" ? (
      <Select value={jobType} onValueChange={(v) => updateParam("jobType", v)}>
        <SelectTrigger className={selectTriggerClass}>
          <SelectValue>
            {(v: string) => (v === ALL ? "All Job Types" : JOB_TYPES.find((j) => j.value === v)?.label ?? v)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All Job Types</SelectItem>
          {JOB_TYPES.map((j) => (
            <SelectItem key={j.value} value={j.value}>
              {j.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ) : (
      <Select value={season} onValueChange={(v) => updateParam("season", v)}>
        <SelectTrigger className={selectTriggerClass}>
          <SelectValue>
            {(v: string) => (v === ALL ? "All Seasons" : SEASONS.find((s) => s.value === v)?.label ?? v)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All Seasons</SelectItem>
          {SEASONS.map((s) => (
            <SelectItem key={s.value} value={s.value}>
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );

  const remotePolicySelect = (
    <Select value={remotePolicy} onValueChange={(v) => updateParam("remotePolicy", v)}>
      <SelectTrigger className={selectTriggerClass}>
        <SelectValue>
          {(v: string) =>
            v === ALL ? "All Remote Policies" : REMOTE_POLICIES.find((r) => r.value === v)?.label ?? v
          }
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL}>All Remote Policies</SelectItem>
        {REMOTE_POLICIES.map((r) => (
          <SelectItem key={r.value} value={r.value}>
            {r.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  const sortSelect = (
    <Select value={sort} onValueChange={(v) => updateParam("sort", v)}>
      <SelectTrigger className={selectTriggerClass} aria-label="Sort">
        <SelectValue>
          {(v: string) =>
            `Sort: ${sortOptions.find((s) => s.value === v)?.label ?? "Most recent"}`
          }
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((s) => (
          <SelectItem key={s.value} value={s.value}>
            {s.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  return (
    <div
      className={cn(
        "mt-8 flex flex-col gap-3 transition-opacity sm:flex-row sm:flex-wrap sm:items-center",
        isPending && "opacity-70",
      )}
    >
      <div className="flex h-11 min-w-[240px] flex-1 items-center gap-2 rounded-md border-[3px] border-neutral-950 bg-card px-3 shadow-brutal-xs">
        {isPending ? (
          <Loader2 className="size-4 shrink-0 animate-spin text-muted-foreground" aria-hidden />
        ) : (
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        )}
        <input
          type="search"
          aria-label="Search by title, keyword, or company"
          value={q}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by title, keyword, or company"
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      {/* Below sm: everything but search collapses into one "Filters" dialog so
          results aren't pushed hundreds of pixels down the page. sm and up:
          unchanged inline row (rendered via `hidden sm:contents`). */}
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="gap-2 sm:hidden"
        onClick={() => setMobileFiltersOpen(true)}
      >
        <SlidersHorizontal className="size-4" aria-hidden />
        Filters
      </Button>

      <Dialog open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto border-[3px] border-neutral-950 shadow-brutal-md">
          <div className="flex flex-col gap-3 pt-6">
            {locationSelect}
            {departmentSelect}
            {jobTypeOrSeasonSelect}
            {remotePolicySelect}
            {sortSelect}
          </div>
        </DialogContent>
      </Dialog>

      <div className="hidden sm:contents">
        {locationSelect}
        {departmentSelect}
        {jobTypeOrSeasonSelect}

        <Button
          type="button"
          variant="outline"
          size="lg"
          className="gap-2"
          onClick={() => setShowMore((s) => !s)}
          aria-expanded={showMore}
        >
          <SlidersHorizontal className="size-4" aria-hidden />
          Filters
        </Button>

        {showMore && remotePolicySelect}

        {sortSelect}
      </div>
    </div>
  );
}
