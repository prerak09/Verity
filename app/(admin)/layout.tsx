import {
  LayoutDashboard,
  ShieldCheck,
  Flag,
  Building2,
  Briefcase,
  Users,
  Tags,
  Star,
  BarChart3,
  Settings,
  HelpCircle,
} from "lucide-react";

import { PortalShell } from "@/components/shared/PortalShell";
import { navIcon } from "@/components/shared/Sidebar/nav-icon";
import type { NavSection } from "@/components/shared/Sidebar/Sidebar";

const SECTIONS: NavSection[] = [
  {
    items: [
      { href: "/admin", icon: navIcon(LayoutDashboard), label: "Dashboard", exact: true },
      { href: "/admin/verification", icon: navIcon(ShieldCheck), label: "Verification Queue" },
      { href: "/admin/reports", icon: navIcon(Flag), label: "Reports" },
      { href: "/admin/companies", icon: navIcon(Building2), label: "Companies" },
      { href: "/admin/internships", icon: navIcon(Briefcase), label: "Internships" },
      { href: "/admin/jobs", icon: navIcon(Briefcase), label: "Jobs" },
      { href: "/admin/users", icon: navIcon(Users), label: "Users" },
      { href: "/admin/taxonomy", icon: navIcon(Tags), label: "Categories / Technologies" },
      { href: "/admin/featured", icon: navIcon(Star), label: "Featured" },
      { href: "/admin/analytics", icon: navIcon(BarChart3), label: "Platform Analytics" },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/admin/settings", icon: navIcon(Settings), label: "Settings" },
    ],
  },
  {
    label: "Support",
    items: [
      { href: "/admin/help", icon: navIcon(HelpCircle), label: "Help Center" },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PortalShell sections={SECTIONS} settingsHref="/admin/settings">
      {children}
    </PortalShell>
  );
}
