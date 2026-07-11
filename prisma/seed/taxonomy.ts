// prisma/seed/taxonomy.ts — canonical Category + Technology taxonomy.

import type { PrismaClient } from "@prisma/client";
import type { SeededTaxonomy } from "./types";

const CATEGORIES = [
  { slug: "fintech", name: "Fintech" },
  { slug: "ai-ml", name: "AI / ML" },
  { slug: "devtools", name: "Developer Tools" },
  { slug: "healthtech", name: "Healthtech" },
  { slug: "saas", name: "SaaS" },
  { slug: "consumer", name: "Consumer" },
  { slug: "infrastructure", name: "Cloud Infrastructure & Security" },
  { slug: "edtech", name: "Edtech" },
];

const TECHNOLOGIES = [
  { slug: "react", name: "React" },
  { slug: "typescript", name: "TypeScript" },
  { slug: "python", name: "Python" },
  { slug: "postgres", name: "PostgreSQL" },
  { slug: "nextjs", name: "Next.js" },
  { slug: "go", name: "Go" },
  { slug: "rust", name: "Rust" },
  { slug: "pytorch", name: "PyTorch" },
  { slug: "graphql", name: "GraphQL" },
  { slug: "aws", name: "AWS" },
  { slug: "gcp", name: "GCP" },
  { slug: "kubernetes", name: "Kubernetes" },
  { slug: "nodejs", name: "Node.js" },
  { slug: "cpp", name: "C++" },
  { slug: "django", name: "Django" },
  { slug: "azure", name: "Azure" },
  { slug: "mongodb", name: "MongoDB" },
];

export async function seedTaxonomy(db: PrismaClient): Promise<SeededTaxonomy> {
  const categories: Record<string, string> = {};
  for (const c of CATEGORIES) {
    const row = await db.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name },
      create: c,
    });
    categories[c.slug] = row.id;
  }

  const technologies: Record<string, string> = {};
  for (const t of TECHNOLOGIES) {
    const row = await db.technology.upsert({
      where: { slug: t.slug },
      update: { name: t.name },
      create: t,
    });
    technologies[t.slug] = row.id;
  }

  console.log(
    `  ✓ taxonomy: ${CATEGORIES.length} categories, ${TECHNOLOGIES.length} technologies`,
  );
  return { categories, technologies };
}
