"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

import type { FundingStage, TaxonomyRef } from "@/types";
import { cn } from "@/components/lib/utils";

const STAGES: { value: FundingStage; label: string }[] = [
  { value: "BOOTSTRAPPED", label: "Bootstrapped" },
  { value: "PRE_SEED", label: "Pre-Seed" },
  { value: "SEED", label: "Seed" },
  { value: "SERIES_A", label: "Series A" },
  { value: "SERIES_B", label: "Series B" },
  { value: "SERIES_C_PLUS", label: "Series C+" },
  { value: "PUBLIC", label: "Public" },
];

function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 py-1 font-mono text-sm text-neutral-800">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-4 shrink-0 rounded-[2px] border-2 border-neutral-950 accent-[var(--color-primary)]"
      />
      {label}
    </label>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b-2 border-neutral-950/10 pb-4">
      <h3 className="font-mono text-xs font-bold uppercase tracking-[0.06em] text-neutral-950">
        {title}
      </h3>
      <div className="mt-2">{children}</div>
    </div>
  );
}

export function CompaniesFilterSidebar({
  categories,
  locations,
}: {
  categories: TaxonomyRef[];
  locations: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category = searchParams.get("category");
  const location = searchParams.get("location");
  const stage = searchParams.get("stage");

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function clearAll() {
    const params = new URLSearchParams(searchParams.toString());
    for (const key of ["q", "category", "location", "stage", "hiring"]) {
      params.delete(key);
    }
    params.delete("page");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  const hasActiveFilters = Boolean(
    searchParams.get("q") || category || location || stage || searchParams.get("hiring"),
  );

  return (
    <aside className="retro-card space-y-4 p-4 lg:sticky lg:top-24 lg:self-start">
      <div className="flex items-center gap-2 border-b-2 border-neutral-950/10 pb-3 font-mono text-sm font-bold uppercase tracking-[0.06em] text-neutral-950">
        <SlidersHorizontal className="size-4" aria-hidden />
        Filters
      </div>

      <FilterSection title="Industry">
        <CheckboxRow label="All Industries" checked={!category} onChange={() => updateParam("category", null)} />
        {categories.map((c) => (
          <CheckboxRow
            key={c.id}
            label={c.name}
            checked={category === c.slug}
            onChange={() => updateParam("category", category === c.slug ? null : c.slug)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Location">
        <CheckboxRow label="All Locations" checked={!location} onChange={() => updateParam("location", null)} />
        {locations.map((loc) => (
          <CheckboxRow
            key={loc}
            label={loc}
            checked={location === loc}
            onChange={() => updateParam("location", location === loc ? null : loc)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Stage">
        <CheckboxRow label="All Stages" checked={!stage} onChange={() => updateParam("stage", null)} />
        {STAGES.map((s) => (
          <CheckboxRow
            key={s.value}
            label={s.label}
            checked={stage === s.value}
            onChange={() => updateParam("stage", stage === s.value ? null : s.value)}
          />
        ))}
      </FilterSection>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearAll}
          className={cn(
            "flex w-full items-center justify-center gap-1.5 rounded-[3px] border-[3px] border-neutral-950 bg-card py-2 font-mono text-sm font-bold text-neutral-800 transition-transform hover:-translate-y-0.5",
          )}
        >
          <RotateCcw className="size-3.5" aria-hidden />
          Clear all filters
        </button>
      )}
    </aside>
  );
}
