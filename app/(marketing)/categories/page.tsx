import type { Metadata } from "next";
import Link from "next/link";
import {
  Landmark,
  Terminal,
  Sparkles,
  HeartPulse,
  Leaf,
  Truck,
  ShoppingBag,
  ShieldCheck,
  Tag,
  type LucideIcon,
} from "lucide-react";

import { MOCK_CATEGORIES, MOCK_COMPANY_DETAILS } from "@/components/lib/mocks";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse verified companies by category.",
};

// Small, deliberate icon set per category (doc's card language, not a
// data field — categories in the DTO are just { id, slug, name }).
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  fintech: Landmark,
  "developer-tools": Terminal,
  "ai-ml": Sparkles,
  healthtech: HeartPulse,
  climate: Leaf,
  logistics: Truck,
  consumer: ShoppingBag,
  security: ShieldCheck,
};

export default function CategoriesPage() {
  const companies = Object.values(MOCK_COMPANY_DETAILS);
  const counts = new Map<string, number>();
  for (const company of companies) {
    for (const category of company.categories) {
      counts.set(category.slug, (counts.get(category.slug) ?? 0) + 1);
    }
  }

  return (
    <div className="mx-auto max-w-wide px-4 py-12 sm:px-6">
      <div className="max-w-2xl">
        <span className="retro-eyebrow">Browse</span>
        <h1 className="mt-4 font-display text-4xl font-bold text-neutral-950">Categories</h1>
        <p className="mt-2 text-body text-muted-foreground">
          Find verified companies by the space they work in.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_CATEGORIES.map((category) => {
          const Icon = CATEGORY_ICONS[category.slug] ?? Tag;
          const count = counts.get(category.slug) ?? 0;
          return (
            <Link
              key={category.id}
              href={`/search?category=${category.slug}`}
              className="group rounded-[4px] border-[3px] border-neutral-950 bg-card p-5 shadow-brutal-md transition-[transform,box-shadow] duration-150 hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-brutal-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <div className="flex size-11 items-center justify-center rounded-lg border-[3px] border-neutral-950 bg-tile-lavender">
                <Icon className="size-5 text-brand-700" strokeWidth={1.75} aria-hidden />
              </div>
              <p className="mt-4 font-display text-h4 text-foreground">
                {category.name}
              </p>
              <p className="mt-1 text-body-sm text-muted-foreground">
                {count} {count === 1 ? "company" : "companies"}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
