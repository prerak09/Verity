"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/components/lib/utils";

/** Snap-scrolling horizontal row with circular prev/next buttons. Scrolls by
 *  ~85% of the visible width per click — no carousel library, just native
 *  scroll-snap + scrollBy. */
export function HorizontalCarousel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "prev" | "next") {
    const el = trackRef.current;
    if (!el) return;
    const delta = el.clientWidth * 0.85 * (direction === "next" ? 1 : -1);
    el.scrollBy({ left: delta, behavior: "smooth" });
  }

  return (
    <div className={cn("relative", className)}>
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      <button
        type="button"
        onClick={() => scroll("prev")}
        aria-label="Scroll left"
        className="absolute -left-4 top-[calc(50%-1rem)] hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-neutral-950 bg-card shadow-brutal-xs hover:bg-muted sm:flex"
      >
        <ChevronLeft className="size-4" aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => scroll("next")}
        aria-label="Scroll right"
        className="absolute -right-4 top-[calc(50%-1rem)] hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-neutral-950 bg-card shadow-brutal-xs hover:bg-muted sm:flex"
      >
        <ChevronRight className="size-4" aria-hidden />
      </button>
    </div>
  );
}
