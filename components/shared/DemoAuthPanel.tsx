import Link from "next/link";
import { GraduationCap, Building2, Shield, ArrowRight } from "lucide-react";

/**
 * Shown on /sign-in and /sign-up when NEXT_PUBLIC_DEMO_MODE is on (no Clerk
 * project). Real auth is mocked, so we just let the visitor jump straight into
 * any portal — a working, on-theme replacement for the Clerk form.
 */
const ENTRIES = [
  {
    href: "/dashboard",
    icon: GraduationCap,
    tile: "bg-tile-lavender",
    label: "Enter as Student",
    sub: "Search startups, bookmark, track applications",
  },
  {
    href: "/company",
    icon: Building2,
    tile: "bg-tile-yellow",
    label: "Enter as Company",
    sub: "Manage your profile, internships, and team",
  },
  {
    href: "/admin",
    icon: Shield,
    tile: "bg-tile-pink",
    label: "Enter as Admin",
    sub: "Verification queue, moderation, analytics",
  },
];

export function DemoAuthPanel({ mode }: { mode: "sign-in" | "sign-up" }) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-2xl font-bold text-neutral-950">
          {mode === "sign-in" ? "Welcome back" : "Create your account"}
        </h2>
        <p className="mt-1 font-mono text-sm text-neutral-600">
          This is a live demo — pick a portal to explore. No password needed.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {ENTRIES.map(({ href, icon: Icon, tile, label, sub }) => (
          <Link
            key={href}
            href={href}
            className="retro-hover group flex items-center gap-3 rounded-[3px] border-[3px] border-neutral-950 bg-card p-3 [box-shadow:3px_3px_0_0_var(--color-neutral-950)]"
          >
            <span
              className={`inline-flex size-11 shrink-0 items-center justify-center rounded-[3px] border-[3px] border-neutral-950 ${tile}`}
            >
              <Icon className="size-5 text-neutral-950" strokeWidth={2.25} aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-display text-sm font-bold text-neutral-950">
                {label}
              </span>
              <span className="block font-mono text-xs text-neutral-600">{sub}</span>
            </span>
            <ArrowRight
              className="size-4 shrink-0 text-neutral-950 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        ))}
      </div>

      <p className="font-mono text-xs text-neutral-500">
        Browsing the public demo?{" "}
        <Link href="/companies" className="font-bold text-primary hover:underline">
          Explore startups
        </Link>{" "}
        without signing in.
      </p>
    </div>
  );
}
