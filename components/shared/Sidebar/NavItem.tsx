"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/components/lib/utils";

/** Public config shape — Sidebar's callers pass icon *components* (e.g. `icon: Search`). */
export interface NavItemDef {
  href: string;
  icon: LucideIcon;
  label: string;
  count?: number;
  /** Match the href exactly rather than by prefix (e.g. the portal's own /dashboard root). */
  exact?: boolean;
}

interface NavItemProps {
  href: string;
  /** Already-rendered by Sidebar (a Server Component) — a bare component
   * reference can't cross the server/client prop boundary, only elements can. */
  icon: React.ReactNode;
  label: string;
  count?: number;
  exact?: boolean;
}

/**
 * Active nav item gets the full brutalist treatment — border-2 + brand tint
 * + hard shadow — so "where am I" is unmistakable (doc §12.6).
 */
export function NavItem({ href, icon, label, count, exact }: NavItemProps) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex h-10 items-center gap-2.5 rounded-md px-3 text-sm font-medium transition-colors",
        active
          ? "border-2 border-border bg-brand-50 text-brand-800 shadow-brutal-xs"
          : "border-2 border-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
      )}
    >
      {icon}
      <span className="flex-1 truncate">{label}</span>
      {count != null && count > 0 && (
        <span className="rounded-sm border-2 border-border bg-background px-1.5 text-[0.6875rem] font-bold tabular-nums">
          {count}
        </span>
      )}
    </Link>
  );
}
