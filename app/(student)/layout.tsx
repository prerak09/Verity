import {
  LayoutDashboard,
  Search,
  Bookmark,
  Briefcase,
  UserCircle,
  Settings,
  HelpCircle,
  Building2,
  GraduationCap,
  Layers,
  LayoutGrid,
} from "lucide-react";

import { PortalShell } from "@/components/shared/PortalShell";
import { navIcon } from "@/components/shared/Sidebar/nav-icon";
import type { NavSection } from "@/components/shared/Sidebar/Sidebar";

const SECTIONS: NavSection[] = [
  {
    items: [
      { href: "/dashboard", icon: navIcon(LayoutDashboard), label: "Dashboard", exact: true },
      { href: "/search", icon: navIcon(Search), label: "Search" },
      { href: "/bookmarks", icon: navIcon(Bookmark), label: "Bookmarks" },
      { href: "/applications", icon: navIcon(Briefcase), label: "Applications" },
    ],
  },
  {
    label: "Explore",
    items: [
      { href: "/companies", icon: navIcon(Building2), label: "Startups" },
      { href: "/internships", icon: navIcon(GraduationCap), label: "Internships" },
      { href: "/jobs", icon: navIcon(Layers), label: "Jobs" },
      { href: "/categories", icon: navIcon(LayoutGrid), label: "Categories" },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/dashboard/profile", icon: navIcon(UserCircle), label: "Profile" },
      { href: "/dashboard/settings", icon: navIcon(Settings), label: "Settings" },
    ],
  },
  {
    label: "Support",
    items: [
      { href: "/dashboard/help", icon: navIcon(HelpCircle), label: "Help Center" },
    ],
  },
];

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalShell sections={SECTIONS} profileHref="/dashboard/profile" settingsHref="/dashboard/settings">
      {children}
    </PortalShell>
  );
}
