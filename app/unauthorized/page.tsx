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
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-8 bg-muted px-4 py-16 text-center">
      <Logo />
      <div className="flex flex-col items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-xl border-2 border-warning-border bg-warning-bg shadow-brutal-sm">
          <ShieldAlert className="size-7 text-warning-fg" strokeWidth={1.75} aria-hidden />
        </div>
        <div>
          <h1 className="font-display text-h3 text-foreground">
            Wrong portal for this account
          </h1>
          <p className="mt-1 max-w-sm text-body-sm text-muted-foreground">
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
