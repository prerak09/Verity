import Link from "next/link";
import { ShieldAlert } from "lucide-react";

import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Student dashboard" },
  { href: "/company", label: "Company portal" },
  { href: "/admin", label: "Admin portal" },
];

/**
 * middleware.ts redirects role-gated misses here (TRD §8, CONTRACTS.md
 * CR-2). Not a security boundary — just points people back to the right door.
 */
export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-8 px-4 py-16 text-center">
      <Logo />
      <div className="retro-card flex max-w-md flex-col items-center gap-4 p-8">
        <div className="flex size-16 items-center justify-center rounded-[3px] border-[3px] border-neutral-950 bg-tile-yellow [box-shadow:3px_3px_0_0_var(--color-neutral-950)]">
          <ShieldAlert className="size-8 text-neutral-950" strokeWidth={2} aria-hidden />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-950">
            Wrong portal for this account
          </h1>
          <p className="mt-2 max-w-sm font-mono text-sm text-neutral-700">
            Your account doesn&apos;t have access to that page. Here&apos;s where
            you can go instead.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {LINKS.map((link, i) => (
          <Button
            key={link.href}
            variant={i === 0 ? "default" : "outline"}
            size="sm"
            render={<Link href={link.href} />}
          >
            {link.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
