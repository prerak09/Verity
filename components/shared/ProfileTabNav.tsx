"use client";

import { useEffect, useState } from "react";

import { cn } from "@/components/lib/utils";

interface Tab {
  id: string;
  label: string;
}

/**
 * Sticky in-page tab bar for the company profile (matches the reference:
 * Overview / About / Team / Funding / Careers / News). Anchors to sections by
 * id and highlights the one in view. Only renders tabs whose section exists.
 */
export function ProfileTabNav({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.id);

  useEffect(() => {
    const sections = tabs
      .map((t) => document.getElementById(t.id))
      .filter((el): el is HTMLElement => !!el);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: 0 },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [tabs]);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(id);
  }

  return (
    <nav className="sticky top-16 z-20 -mx-4 mb-8 border-b-[3px] border-neutral-950 bg-background/95 px-4 backdrop-blur sm:mx-0 sm:px-0">
      <ul className="flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <li key={tab.id}>
            <button
              type="button"
              onClick={() => scrollTo(tab.id)}
              aria-current={active === tab.id ? "true" : undefined}
              className={cn(
                "relative whitespace-nowrap px-3 py-3 font-mono text-sm font-bold transition-colors",
                active === tab.id
                  ? "text-neutral-950"
                  : "text-neutral-500 hover:text-neutral-950",
              )}
            >
              {tab.label}
              {active === tab.id && (
                <span className="absolute inset-x-2 -bottom-[3px] h-[3px] bg-primary" />
              )}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
