// config/seasons.ts — single source of truth for Season labels/options.
// Consumed by the card, detail page, filter bar, sort control, and create form
// so the mapping never drifts across surfaces (audit ISSUE-028).

import type { Season } from "@/types";

export const SEASON_LABEL: Record<Season, string> = {
  SUMMER: "Summer",
  FALL: "Fall",
  SPRING: "Spring",
  WINTER: "Winter",
  YEAR_ROUND: "Year-round",
};

export const SEASON_OPTIONS: { value: Season; label: string }[] = (
  Object.keys(SEASON_LABEL) as Season[]
).map((value) => ({ value, label: SEASON_LABEL[value] }));
