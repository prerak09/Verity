import type { Metadata } from "next";

import { TaxonomyManager } from "@/features/admin/components/TaxonomyManager";
import { MOCK_CATEGORIES, MOCK_TECHNOLOGIES } from "@/components/lib/mocks";

export const metadata: Metadata = {
  title: "Categories / Technologies",
};

export default function AdminTaxonomyPage() {
  return (
    <div className="mx-auto max-w-wide px-4 py-8 sm:px-6">
      <h1 className="text-h1 text-foreground">Categories / Technologies</h1>
      <p className="mt-1 text-body text-muted-foreground">
        Add new tags, rename categories, or merge duplicates.
      </p>
      <div className="mt-6">
        <TaxonomyManager initialCategories={MOCK_CATEGORIES} initialTechnologies={MOCK_TECHNOLOGIES} />
      </div>
    </div>
  );
}
