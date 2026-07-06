import { Navbar } from "@/components/shared/Navbar";
import { Logo } from "@/components/shared/Logo";
import { getCurrentUser } from "@/lib/auth";

const NAV_LINKS = [
  { href: "/companies", label: "Product" },
  { href: "/companies", label: "Browse Startups" },
  { href: "/internships", label: "Career", badge: "NEW" },
  { href: "/categories", label: "Category" },
  { href: "/sign-up", label: "Pricing" },
];

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-full flex-col">
      <Navbar variant="marketing" links={NAV_LINKS} signedIn={Boolean(user)} />
      <main className="flex-1">{children}</main>
      <footer className="border-t-[3px] border-neutral-950 bg-[#EFF3D2]">
        <div className="mx-auto flex max-w-wide flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
          <Logo />
          <p className="font-mono text-sm text-neutral-700">
            &copy; {new Date().getFullYear()} Verity. Verified startups, real internships.
          </p>
        </div>
      </footer>
    </div>
  );
}
