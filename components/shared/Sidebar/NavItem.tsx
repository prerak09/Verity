"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/components/lib/utils";

/**
 * Public config shape. `icon` is a pre-rendered element (build it with the
 * `navIcon()` helper from a Server Component) — a bare icon *component*
 * can't cross a server→client prop boundary, only rendered elements can,
 * and this config often flows through PortalShell ("use client").
 */
export interface NavItemDef {
  href: string;
  icon: React.ReactNode;
  label: string;
  count?: number;
  /** Match the href exactly rather than by prefix (e.g. the portal's own /dashboard root). */
  exact?: boolean;
}

type NavItemProps = NavItemDef;

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
          : "border-2 border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
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
