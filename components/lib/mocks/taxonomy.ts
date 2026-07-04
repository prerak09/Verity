// Mock fixtures (Phase 0.7) — contract-first: build every screen against
// types/index.ts with this data, then swap to the real query/action import
// the moment Dev A's implementation lands. See TEAM/00-work-division.md.

import type { TaxonomyRef } from "@/types";

export const MOCK_CATEGORIES: TaxonomyRef[] = [
  { id: "cat_fintech", slug: "fintech", name: "Fintech" },
  { id: "cat_devtools", slug: "developer-tools", name: "Developer Tools" },
  { id: "cat_ai", slug: "ai-ml", name: "AI / ML" },
  { id: "cat_healthtech", slug: "healthtech", name: "Healthtech" },
  { id: "cat_climate", slug: "climate", name: "Climate" },
  { id: "cat_logistics", slug: "logistics", name: "Logistics" },
  { id: "cat_consumer", slug: "consumer", name: "Consumer" },
  { id: "cat_security", slug: "security", name: "Security" },
];

export const MOCK_TECHNOLOGIES: TaxonomyRef[] = [
  { id: "tech_typescript", slug: "typescript", name: "TypeScript" },
  { id: "tech_python", slug: "python", name: "Python" },
  { id: "tech_react", slug: "react", name: "React" },
  { id: "tech_go", slug: "go", name: "Go" },
  { id: "tech_postgres", slug: "postgresql", name: "PostgreSQL" },
  { id: "tech_kubernetes", slug: "kubernetes", name: "Kubernetes" },
  { id: "tech_rust", slug: "rust", name: "Rust" },
  { id: "tech_aws", slug: "aws", name: "AWS" },
];
