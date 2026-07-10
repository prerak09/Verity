import { Navbar } from "@/components/shared/Navbar";
import { Logo } from "@/components/shared/Logo";

const NAV_LINKS = [
  { href: "/", label: "Product" },
  { href: "/companies", label: "Browse Startups" },
  { href: "/internships", label: "Career" },
  { href: "/companies", label: "Users" },
  { href: "/categories", label: "Resources" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar variant="marketing" links={NAV_LINKS} />
      <main className="flex-1">{children}</main>
      <footer className="border-t-2 border-border bg-muted">
        <div className="mx-auto flex max-w-wide flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <Logo />
          <p className="text-body-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Verity. Verified companies, real internships.
          </p>
        </div>
      </footer>
    </div>
  );
}
