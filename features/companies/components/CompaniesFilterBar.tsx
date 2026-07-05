"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, LayoutGrid, List } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/lib/utils";

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "recent", label: "Recently added" },
  { value: "trending", label: "Trending" },
  { value: "name", label: "Alphabetical" },
];

const QUICK_FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "All Startups" },
  { key: "hiring", label: "Hiring Now" },
  { key: "early", label: "Early Stage" },
  { key: "well-funded", label: "Well Funded" },
];

export function CompaniesFilterBar({ view }: { view: "grid" | "list" }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function updateParams(next: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function handleSearchChange(value: string) {
    setQ(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateParams({ q: value || null }), 250);
  }

  const hiringNow = searchParams.get("hiring") === "true";
  const stage = searchParams.get("stage");
  const activeQuickFilter = hiringNow
    ? "hiring"
    : stage === "EARLY_STAGE"
      ? "early"
      : stage === "WELL_FUNDED"
        ? "well-funded"
        : "all";

  function selectQuickFilter(key: string) {
    if (key === "all") updateParams({ hiring: null, stage: null });
    else if (key === "hiring") updateParams({ hiring: "true", stage: null });
    else if (key === "early") updateParams({ hiring: null, stage: "EARLY_STAGE" });
    else if (key === "well-funded") updateParams({ hiring: null, stage: "WELL_FUNDED" });
  }

  const sort = searchParams.get("sort") ?? "relevance";

  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex h-11 min-w-[240px] flex-1 items-center gap-2 rounded-md border-[3px] border-neutral-950 bg-card px-3 shadow-brutal-xs">
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <input
            type="search"
            aria-label="Search startups, keywords, or industries"
            value={q}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search startups, keywords, or industries…"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center gap-1.5 rounded-md border-[3px] border-neutral-950 bg-card p-1 shadow-brutal-xs">
          <Button
            type="button"
            variant={view === "grid" ? "secondary" : "ghost"}
            size="icon-sm"
            aria-label="Grid view"
            aria-pressed={view === "grid"}
            className="border-none shadow-none"
            onClick={() => updateParams({ view: "grid" })}
          >
            <LayoutGrid className="size-4" aria-hidden />
          </Button>
          <Button
            type="button"
            variant={view === "list" ? "secondary" : "ghost"}
            size="icon-sm"
            aria-label="List view"
            aria-pressed={view === "list"}
            className="border-none shadow-none"
            onClick={() => updateParams({ view: "list" })}
          >
            <List className="size-4" aria-hidden />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {QUICK_FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => selectQuickFilter(f.key)}
              aria-pressed={activeQuickFilter === f.key}
              className={cn(
                "rounded-[3px] border-[3px] border-neutral-950 px-3 py-1.5 font-mono text-sm font-bold transition-transform hover:-translate-y-0.5",
                activeQuickFilter === f.key
                  ? "bg-lavender-400 text-neutral-950 [box-shadow:2px_2px_0_0_var(--color-neutral-950)]"
                  : "bg-card text-neutral-800",
              )}
            >
              {f.label}
            </button>
          ))}
          <Link
            href="/internships"
            className="rounded-[3px] border-[3px] border-neutral-950 bg-card px-3 py-1.5 font-mono text-sm font-bold text-neutral-800 transition-transform hover:-translate-y-0.5"
          >
            Internships
          </Link>
        </div>

        <Select value={sort} onValueChange={(v) => updateParams({ sort: v === "relevance" ? null : v })}>
          <SelectTrigger className="h-9 rounded-md border-[3px] border-neutral-950 bg-card px-3 text-sm shadow-brutal-xs">
            <SelectValue>
              {(v: string) => `Sort by: ${SORT_OPTIONS.find((s) => s.value === v)?.label ?? "Relevance"}`}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
