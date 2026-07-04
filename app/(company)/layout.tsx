import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Newspaper,
  Users,
  BarChart3,
  ShieldCheck,
  Settings,
} from "lucide-react";

import { PortalShell } from "@/components/shared/PortalShell";
import { navIcon } from "@/components/shared/Sidebar/nav-icon";
import type { NavSection } from "@/components/shared/Sidebar/Sidebar";

const SECTIONS: NavSection[] = [
  {
    items: [
      { href: "/company", icon: navIcon(LayoutDashboard), label: "Dashboard", exact: true },
      { href: "/company/profile", icon: navIcon(Building2), label: "Company Profile" },
      { href: "/company/internships", icon: navIcon(Briefcase), label: "Internships" },
      { href: "/company/news", icon: navIcon(Newspaper), label: "Company News" },
      { href: "/company/team", icon: navIcon(Users), label: "Team" },
      { href: "/company/analytics", icon: navIcon(BarChart3), label: "Analytics" },
      { href: "/company/verification", icon: navIcon(ShieldCheck), label: "Verification Status" },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/company/settings", icon: navIcon(Settings), label: "Settings" },
    ],
  },
];

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortalShell sections={SECTIONS}>{children}</PortalShell>;
}
