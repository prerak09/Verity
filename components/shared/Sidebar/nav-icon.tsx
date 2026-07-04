import type { LucideIcon } from "lucide-react";

/**
 * Not "use client" — callable from Server Component layouts building nav
 * config. A bare icon *component* can't cross a server→client prop boundary
 * (only rendered elements can), so nav configs build the element here,
 * server-side, before handing it to PortalShell/Sidebar.
 */
export function navIcon(Icon: LucideIcon) {
  return <Icon className="size-4 shrink-0" strokeWidth={2} aria-hidden />;
}
