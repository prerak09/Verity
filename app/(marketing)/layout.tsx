import { Navbar } from "@/components/shared/Navbar";
import { Logo } from "@/components/shared/Logo";
import { getCurrentUser } from "@/lib/auth";

const NAV_LINKS = [
  { href: "/companies", label: "Startups" },
  { href: "/internships", label: "Internships" },
  { href: "/jobs", label: "Jobs", badge: "NEW" },
  { href: "/categories", label: "Categories" },
];

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const navLinks = user
    ? [...NAV_LINKS, { href: "/dashboard", label: "Dashboard" }]
    : NAV_LINKS;

  return (
    <div className="flex min-h-full flex-col">
      <Navbar variant="marketing" links={navLinks} signedIn={Boolean(user)} />
      <main id="main-content" className="flex-1">{children}</main>
      <footer className="border-t-[3px] border-neutral-950 bg-[#EFF3D2]">
        <div className="mx-auto flex max-w-wide flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <Logo />
          <p className="font-mono text-sm text-neutral-700">
            &copy; {new Date().getFullYear()} Verity. Verified startups, real opportunities.
          </p>
        </div>
      </footer>
    </div>
  );
}
