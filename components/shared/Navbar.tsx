"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, User as UserIcon, ChevronDown } from "lucide-react";

import { Logo } from "@/components/shared/Logo";
import { NotificationBell } from "@/components/shared/NotificationBell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/components/lib/utils";

interface NavLink {
  href: string;
  label: string;
  badge?: string;
}

interface NavbarProps {
  variant?: "marketing" | "app";
  /** Marketing nav links (variant="marketing" only). */
  links?: NavLink[];
  /** Marketing only: swaps Log in/Sign up for the signed-in bell + account button. */
  signedIn?: boolean;
  /** Center slot for app variant — global search lands here in Phase 2. */
  centerSlot?: React.ReactNode;
  /** Rightmost slot override for app variant — user menu lands here once Clerk (0.6) is wired. */
  userSlot?: React.ReactNode;
  /** Shows the mobile hamburger and wires it to the parent shell's drawer state (0.5). */
  onMobileMenuToggle?: () => void;
  className?: string;
}

/** Bell + avatar chip shown once a session exists (app shell, and marketing when signed in). */
function AccountMenu() {
  return (
    <>
      <NotificationBell />
      <button
        type="button"
        aria-label="Account"
        className="flex items-center gap-2 rounded-[3px] border-[3px] border-neutral-950 bg-card py-1 pl-1 pr-2.5 [box-shadow:2px_2px_0_0_var(--color-neutral-950)] transition-transform hover:-translate-y-0.5"
      >
        <span className="grid size-7 place-items-center rounded-[2px] border-2 border-neutral-950 bg-tile-lavender">
          <UserIcon className="size-4 text-neutral-950" strokeWidth={2.25} aria-hidden />
        </span>
        <ChevronDown className="size-3.5 text-neutral-700" aria-hidden />
      </button>
    </>
  );
}

/**
 * Sticky top bar (doc §12.7). Marketing swaps the center search for nav
 * links and the right slot for Sign in / Get started; the app variant
 * carries search + notifications + user menu.
 */
export function Navbar({
  variant = "app",
  links = [],
  signedIn = false,
  centerSlot,
  userSlot,
  onMobileMenuToggle,
  className,
}: NavbarProps) {
  const [marketingMenuOpen, setMarketingMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 h-16 border-b-[3px] border-neutral-950 bg-[#EFF3D2]",
        className,
      )}
    >
      <div className="mx-auto flex h-full max-w-wide items-center gap-4 px-4 sm:px-6">
        {onMobileMenuToggle && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open menu"
            onClick={onMobileMenuToggle}
          >
            <Menu className="size-5" aria-hidden />
          </Button>
        )}

        <Logo />

        {variant === "marketing" ? (
          <>
            <nav className="ml-8 hidden items-center gap-6 md:flex">
              {links.map((link) => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className="inline-flex items-center gap-1.5 font-mono text-sm font-medium text-neutral-800 transition-colors hover:text-neutral-950 hover:underline underline-offset-4"
                >
                  {link.label}
                  {link.badge && (
                    <span className="rounded-[3px] border-2 border-neutral-950 bg-primary px-1 py-0 font-mono text-[0.625rem] font-bold text-primary-foreground">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-2.5">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
                onClick={() => setMarketingMenuOpen(true)}
              >
                <Menu className="size-5" aria-hidden />
              </Button>
              {signedIn ? (
                <AccountMenu />
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hidden sm:inline-flex"
                    render={<Link href="/sign-in" />}
                  >
                    Log in
                  </Button>
                  <Button variant="secondary" size="sm" render={<Link href="/sign-up" />}>
                    Sign up
                  </Button>
                </>
              )}
            </div>

            <Dialog open={marketingMenuOpen} onOpenChange={setMarketingMenuOpen}>
              <DialogContent className="border-[3px] border-neutral-950 shadow-brutal-md sm:hidden">
                <nav className="flex flex-col gap-1">
                  {links.map((link) => (
                    <Link
                      key={link.href + link.label}
                      href={link.href}
                      className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                      onClick={() => setMarketingMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href={signedIn ? "/dashboard" : "/sign-in"}
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                    onClick={() => setMarketingMenuOpen(false)}
                  >
                    {signedIn ? "Dashboard" : "Sign in"}
                  </Link>
                </nav>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <>
            {centerSlot && (
              <div className="mx-auto hidden w-full max-w-md sm:block">
                {centerSlot}
              </div>
            )}
            <nav className="ml-auto flex items-center gap-2">
              {userSlot ?? <AccountMenu />}
            </nav>
          </>
        )}
      </div>
    </header>
  );
}
