import type { FundingStage } from "@/types";
import { cn } from "@/components/lib/utils";

// Ordering is intentional (cool → green → gold = early → mature, doc §3.7) —
// never reshuffle. Values reference the CSS custom properties @theme inline
// still exposes on :root even though the utility classes get literal values
// inlined, so this can't be plain Tailwind classes (funding-stage is
// data-driven, and Tailwind's JIT can't see a dynamically built class name).
const FUNDING_META: Record<
  FundingStage,
  { label: string; bg: string; fg: string; border: string }
> = {
  BOOTSTRAPPED: {
    label: "Bootstrapped",
    bg: "var(--color-funding-bootstrapped-bg)",
    fg: "var(--color-funding-bootstrapped-fg)",
    border: "var(--color-funding-bootstrapped-border)",
  },
  PRE_SEED: {
    label: "Pre-seed",
    bg: "var(--color-funding-preseed-bg)",
    fg: "var(--color-funding-preseed-fg)",
    border: "var(--color-funding-preseed-border)",
  },
  SEED: {
    label: "Seed",
    bg: "var(--color-funding-seed-bg)",
    fg: "var(--color-funding-seed-fg)",
    border: "var(--color-funding-seed-border)",
  },
  SERIES_A: {
    label: "Series A",
    bg: "var(--color-funding-seriesa-bg)",
    fg: "var(--color-funding-seriesa-fg)",
    border: "var(--color-funding-seriesa-border)",
  },
  SERIES_B: {
    label: "Series B",
    bg: "var(--color-funding-seriesb-bg)",
    fg: "var(--color-funding-seriesb-fg)",
    border: "var(--color-funding-seriesb-border)",
  },
  SERIES_C_PLUS: {
    label: "Series C+",
    bg: "var(--color-funding-seriescplus-bg)",
    fg: "var(--color-funding-seriescplus-fg)",
    border: "var(--color-funding-seriescplus-border)",
  },
  PUBLIC: {
    label: "Public",
    bg: "var(--color-funding-public-bg)",
    fg: "var(--color-funding-public-fg)",
    border: "var(--color-funding-public-border)",
  },
};

export function FundingChip({
  stage,
  className,
}: {
  stage: FundingStage;
  className?: string;
}) {
  const meta = FUNDING_META[stage];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border-2 px-2 py-0.5 text-[0.6875rem] font-bold uppercase tracking-[0.04em]",
        className,
      )}
      style={{ background: meta.bg, color: meta.fg, borderColor: meta.border }}
    >
      {meta.label}
    </span>
  );
}
