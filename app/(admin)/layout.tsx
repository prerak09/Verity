import {
  LayoutDashboard,
  ShieldCheck,
  Flag,
  Building2,
  Users,
  Tags,
  Star,
  BarChart3,
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
      { href: "/admin/users", icon: navIcon(Users), label: "Users" },
      { href: "/admin/taxonomy", icon: navIcon(Tags), label: "Categories / Technologies" },
      { href: "/admin/featured", icon: navIcon(Star), label: "Featured" },
      { href: "/admin/analytics", icon: navIcon(BarChart3), label: "Platform Analytics" },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PortalShell sections={SECTIONS}>{children}</PortalShell>;
}
