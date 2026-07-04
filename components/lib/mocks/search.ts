import type { SearchResults, SearchSuggestion } from "@/types";

import { MOCK_COMPANIES } from "./companies";
import { MOCK_INTERNSHIPS } from "./internships";
import { MOCK_CATEGORIES } from "./taxonomy";

export const MOCK_SEARCH_RESULTS: SearchResults = {
  companies: MOCK_COMPANIES.slice(0, 4),
  internships: MOCK_INTERNSHIPS.filter((i) => i.status === "PUBLISHED").slice(0, 5),
  totalCompanies: MOCK_COMPANIES.length,
  totalInternships: MOCK_INTERNSHIPS.filter((i) => i.status === "PUBLISHED").length,
};

/**
 * Generated from the full mock catalog rather than a short hand-picked
 * list, so the nav search (2.1) has enough breadth to demo debounced
 * filtering realistically. Mirrors SuggestSearch's actual return shape —
 * label/slug/type only, no logo/badge/chip data (the real signature
 * doesn't carry that, so the dropdown can't render richer rows than this).
 */
export const MOCK_SEARCH_SUGGESTIONS: SearchSuggestion[] = [
  ...MOCK_COMPANIES.map(
    (c): SearchSuggestion => ({ type: "company", label: c.name, slug: c.slug }),
  ),
  ...MOCK_INTERNSHIPS.filter((i) => i.status === "PUBLISHED").map(
    (i): SearchSuggestion => ({
      type: "internship",
      label: i.title,
      slug: i.slug,
    }),
  ),
  ...MOCK_CATEGORIES.map(
    (c): SearchSuggestion => ({ type: "category", label: c.name, slug: c.slug }),
  ),
];
