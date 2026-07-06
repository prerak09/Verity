import type { Metadata } from "next";

import { TaxonomyManager } from "@/features/admin/components/TaxonomyManager";
import { listCategories } from "@/features/companies/queries";
import { listTechnologies } from "@/features/admin/taxonomy";
import { MOCK_CATEGORIES, MOCK_TECHNOLOGIES } from "@/components/lib/mocks";
import type { TaxonomyRef } from "@/types";

export const metadata: Metadata = {
  title: "Categories / Technologies",
};

export const dynamic = "force-dynamic";

export default async function AdminTaxonomyPage() {
  let categories: TaxonomyRef[] = MOCK_CATEGORIES;
  let technologies: TaxonomyRef[] = MOCK_TECHNOLOGIES;

  try {
    const [cats, techs] = await Promise.all([listCategories(), listTechnologies()]);
    categories = cats;
    technologies = techs;
  } catch {
    // DB unreachable — fall back to mock data rather than a hard 500.
  }

  return (
    <div className="mx-auto max-w-wide px-4 py-8 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-neutral-950">Categories / Technologies</h1>
      <p className="mt-1 text-body text-muted-foreground">
        Add new tags, rename categories, or merge duplicates.
      </p>
      <div className="mt-6">
        <TaxonomyManager initialCategories={categories} initialTechnologies={technologies} />
      </div>
    </div>
  );
}
