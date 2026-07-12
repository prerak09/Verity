"use client";

import { useState } from "react";
import Image from "next/image";

import { cn } from "@/components/lib/utils";

const TILE_CLASSES = [
  "bg-tile-lavender",
  "bg-tile-pink",
  "bg-tile-yellow",
  "bg-tile-blue",
  "bg-tile-mint",
  "bg-tile-lime",
] as const;

/** Deterministic tile color so a company always renders the same fallback hue. */
function tileColorClass(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  return TILE_CLASSES[Math.abs(hash) % TILE_CLASSES.length];
}

/**
 * Company/brand logo with two safeguards the raw <Image> lacked:
 *  - object-contain + white padding so wide wordmarks (Walleye, Intuitive,
 *    Samsung, Uber Freight) fit inside the square instead of being cropped.
 *  - an onError fallback to the company initial on a colored tile, so dead
 *    logo URLs (404s) never render a broken-image glyph.
 */
export function CompanyLogo({
  src,
  name,
  seed,
  size = 48,
  className,
}: {
  src: string | null;
  /** Used for the fallback initial + alt text. */
  name: string;
  /** Stable id so the fallback tile color is deterministic. */
  seed: string;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        aria-hidden
        style={{ width: size, height: size }}
        className={cn(
          "flex shrink-0 items-center justify-center rounded-[3px] border-[3px] border-neutral-950 font-display font-bold text-neutral-950",
          tileColorClass(seed),
          className,
        )}
      >
        <span style={{ fontSize: size * 0.42 }}>
          {name.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={`${name} logo`}
      width={size}
      height={size}
      onError={() => setFailed(true)}
      style={{ width: size, height: size }}
      className={cn(
        "shrink-0 rounded-[3px] border-[3px] border-neutral-950 bg-white object-contain p-1.5",
        className,
      )}
    />
  );
}
