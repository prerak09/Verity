import type { SearchResults, SearchSuggestion } from "@/types";

import { MOCK_COMPANIES } from "./companies";
import { MOCK_INTERNSHIPS } from "./internships";

export const MOCK_SEARCH_RESULTS: SearchResults = {
  companies: MOCK_COMPANIES.slice(0, 4),
  internships: MOCK_INTERNSHIPS.filter((i) => i.status === "PUBLISHED").slice(0, 5),
  totalCompanies: MOCK_COMPANIES.length,
  totalInternships: MOCK_INTERNSHIPS.filter((i) => i.status === "PUBLISHED").length,
};

export const MOCK_SEARCH_SUGGESTIONS: SearchSuggestion[] = [
  { type: "company", label: "Ledgerly", slug: "ledgerly" },
  { type: "company", label: "Arclight AI", slug: "arclight-ai" },
  { type: "internship", label: "Backend Engineering Intern", slug: "backend-engineering-intern" },
  { type: "category", label: "Fintech", slug: "fintech" },
  { type: "category", label: "AI / ML", slug: "ai-ml" },
];
