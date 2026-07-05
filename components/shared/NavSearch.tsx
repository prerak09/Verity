"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Building2, Briefcase, Tag } from "lucide-react";

import { MOCK_SEARCH_SUGGESTIONS } from "@/components/lib/mocks";
import type { SearchSuggestion } from "@/types";
import { cn } from "@/components/lib/utils";

const TYPE_ICON: Record<SearchSuggestion["type"], typeof Building2> = {
  company: Building2,
  internship: Briefcase,
  category: Tag,
};

const TYPE_HREF: Record<SearchSuggestion["type"], (slug: string) => string> = {
  company: (slug) => `/companies/${slug}`,
  internship: (slug) => `/internships/${slug}`,
  category: (slug) => `/search?category=${slug}`,
};

const DEBOUNCE_MS = 250;
const MAX_RESULTS = 8;

/**
 * Nav search typeahead (doc §12.5) — debounced 250ms per PRD §16. Mirrors
 * SuggestSearch's real return shape (label/slug/type only), so rows can't
 * show a logo/verified badge/funding chip the way the doc's illustrative
 * mockup does — that data isn't part of the actual function signature.
 */
export function NavSearch({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trimmed = query.trim().toLowerCase();

    const timeout = setTimeout(() => {
      if (!trimmed) {
        setResults([]);
        setOpen(false);
        setActiveIndex(-1);
        return;
      }
      // Swap for suggestSearch(query) the moment Dev A's implementation
      // lands — same call site, same shape.
      const matches = MOCK_SEARCH_SUGGESTIONS.filter((s) =>
        s.label.toLowerCase().includes(trimmed),
      ).slice(0, MAX_RESULTS);
      setResults(matches);
      setOpen(true);
      setActiveIndex(-1);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function navigateTo(suggestion: SearchSuggestion) {
    setOpen(false);
    setQuery("");
    router.push(TYPE_HREF[suggestion.type](suggestion.slug));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      navigateTo(results[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="flex h-9 w-full items-center gap-2 rounded-md border-[3px] border-neutral-950 bg-card px-3 shadow-brutal-xs">
        <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
        <input
          type="search"
          role="combobox"
          aria-label="Search companies"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls="nav-search-listbox"
          aria-activedescendant={activeIndex >= 0 ? `nav-search-option-${activeIndex}` : undefined}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search companies…"
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      {open && (
        <div
          id="nav-search-listbox"
          role="listbox"
          className="absolute top-full left-0 z-50 mt-1.5 w-full overflow-hidden rounded-lg border-[3px] border-neutral-950 bg-popover shadow-brutal-lg"
        >
          {results.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-body-sm text-muted-foreground">
                No companies match.
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-3 text-body-sm">
                <Link href="/companies" className="font-medium text-foreground hover:underline">
                  Browse by category
                </Link>
                <Link href="/companies" className="font-medium text-foreground hover:underline">
                  Suggest a company
                </Link>
              </div>
            </div>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {results.map((result, i) => {
                const Icon = TYPE_ICON[result.type];
                return (
                  <li
                    key={`${result.type}-${result.slug}`}
                    id={`nav-search-option-${i}`}
                    role="option"
                    aria-selected={i === activeIndex}
                  >
                    <button
                      type="button"
                      onClick={() => navigateTo(result)}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={cn(
                        "flex w-full items-center gap-2.5 border-l-2 border-transparent px-3 py-2 text-left text-sm",
                        i === activeIndex
                          ? "border-brand-600 bg-tile-lavender text-brand-800"
                          : "text-foreground hover:bg-muted",
                      )}
                    >
                      <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                      <span className="truncate">{result.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
