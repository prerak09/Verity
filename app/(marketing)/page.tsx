import { Fragment } from "react";
import Link from "next/link";
import {
  Search,
  Zap,
  Mail,
  Bookmark,
  IdCard,
  Play,
  ArrowRight,
  Globe,
  Briefcase,
  Users,
  Star,
  Asterisk,
  Sparkle,
  Minus,
  Square,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    icon: Search,
    bg: "bg-brand-300",
    title: "Verified Data",
    description: "We verify every detail so you can trust what you see.",
  },
  {
    icon: Zap,
    bg: "bg-butter-300",
    title: "Live Insights",
    description: "Stay updated with the latest hiring signals and company news.",
  },
  {
    icon: Mail,
    bg: "bg-pink-300",
    title: "Smart Outreach",
    description: "Personalized emails that help you stand out and get replies.",
  },
  {
    icon: Bookmark,
    bg: "bg-lime-300",
    title: "Track Everything",
    description: "Save, organize, and track your applications in one place.",
  },
];

const STEPS = [
  {
    number: 1,
    badge: "bg-brand-300",
    icon: Search,
    title: "Discover",
    description: "Search and filter startups using 20+ smart filters to find the right ones.",
  },
  {
    number: 2,
    badge: "bg-brand-300",
    icon: IdCard,
    title: "Verify",
    description: "We collect and verify company, founder, and hiring information.",
  },
  {
    number: 3,
    badge: "bg-pink-300",
    icon: Mail,
    title: "Connect",
    description: "Get personalized email templates and build meaningful connections.",
    notification: true,
  },
];

/**
 * Reproduces the reference's "Trusted by" bar 1:1 in style, but not
 * substance — the reference names real companies (Google for Startups, Y
 * Combinator, Techstars, Antler, Startmate). Claiming those specific real
 * companies endorse Verity would be a false-endorsement problem, not a
 * style choice, so the names are placeholder-safe instead.
 */
const TRUSTED_BY = ["Founders Collective", "Seed Forge", "Launchpad+", "BUILD/CO", "Hatchpoint"];

const AVATARS = [
  { skin: "#F0B27A", hair: "#3D2B1F" },
  { skin: "#8D5B3F", hair: "#14120E" },
  { skin: "#C68863", hair: "#5C3A21" },
  { skin: "#F2C79E", hair: "#B8894A" },
  { skin: "#7A4B32", hair: "#14120E" },
];

function AvatarFace({ skin, hair }: { skin: string; hair: string }) {
  return (
    <svg viewBox="0 0 40 40" className="size-full" aria-hidden>
      <circle cx="20" cy="20" r="20" fill={skin} />
      <path d="M0 16C0 6 9 0 20 0s20 6 20 16v2H0v-2Z" fill={hair} />
      <circle cx="14" cy="21" r="1.6" fill="#14120E" />
      <circle cx="26" cy="21" r="1.6" fill="#14120E" />
      <path d="M14 27c2 2 10 2 12 0" stroke="#14120E" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function DotGrid({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={className}
      style={{
        backgroundImage: "radial-gradient(currentColor 1.5px, transparent 1.5px)",
        backgroundSize: "14px 14px",
        color: "var(--border)",
        opacity: 0.35,
      }}
    />
  );
}

function StatCard({
  bg,
  value,
  label,
}: {
  bg: string;
  value: string;
  label: string;
}) {
  return (
    <div className={`rounded-lg border-2 border-border p-3 shadow-brutal-sm ${bg}`}>
      <p className="font-display text-h3 font-bold text-foreground">{value}</p>
      <p className="mt-0.5 text-caption font-medium text-foreground/80">{label}</p>
    </div>
  );
}

function CitySkyline() {
  const buildings = [
    30, 55, 42, 70, 48, 85, 60, 100, 52, 90, 65, 78, 44, 95, 58, 72, 38, 82, 50, 68,
  ];
  const w = 400 / buildings.length;
  return (
    <svg viewBox="0 0 400 110" className="h-full w-full" preserveAspectRatio="xMidYMax meet" aria-hidden>
      <rect width="400" height="110" fill="#FFFFFF" />
      {/* Halftone dot texture over the whole scene — approximates the reference's dithered photo look */}
      <defs>
        <pattern id="halftone" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.6" fill="#14120E" opacity="0.5" />
        </pattern>
      </defs>
      {buildings.map((h, i) => {
        const x = i * w;
        const windowCols = w > 14 ? 3 : 2;
        return (
          <g key={i}>
            <rect x={x + 1} y={110 - h} width={w - 2} height={h} fill="#14120E" />
            {Array.from({ length: Math.floor(h / 7) }).map((_, row) =>
              Array.from({ length: windowCols }).map((_, col) => (
                <rect
                  key={`${row}-${col}`}
                  x={x + 3 + col * ((w - 6) / windowCols)}
                  y={110 - h + 4 + row * 7}
                  width={2}
                  height={3}
                  fill="#F7F3E3"
                  opacity={(row + col) % 3 === 0 ? 0.35 : 0.9}
                />
              )),
            )}
          </g>
        );
      })}
      <rect width="400" height="110" fill="url(#halftone)" opacity="0.4" />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <DotGrid className="absolute top-24 left-0 h-64 w-6" />
        <div className="mx-auto grid max-w-wide gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
          <div>
            <p className="inline-flex items-center rounded-sm border-2 border-border bg-brand-200 px-3 py-1 text-overline text-foreground">
              VERIFIED STARTUP INTELLIGENCE
            </p>
            <h1 className="mt-4 font-display text-display-lg leading-[1.05] font-bold text-foreground sm:text-display-xl">
              Discover.
              <br />
              Verify.
              <br />
              <span className="relative inline-block">
                <span aria-hidden className="absolute top-1.5 left-1.5 h-full w-full rounded-sm bg-border" />
                <span className="relative inline-block rounded-sm bg-brand-300 px-2">Connect.</span>
              </span>
            </h1>
            <p className="mt-5 max-w-prose text-body-lg text-foreground/80">
              Verity helps users discover verified startups, explore open
              roles, and connect with the right people to grow their
              careers.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" className="bg-lime-300 text-foreground hover:bg-lime-200" render={<Link href="/companies" />}>
                Explore Startups
                <ArrowRight className="size-4" aria-hidden />
              </Button>
              <Button variant="outline" size="lg" className="bg-card" render={<Link href="/sign-up" />}>
                See how it works
                <Play className="size-3.5" aria-hidden fill="currentColor" />
              </Button>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-3" aria-hidden>
                {AVATARS.map(({ skin, hair }, i) => (
                  <span
                    key={i}
                    className="size-9 overflow-hidden rounded-full border-2 border-border"
                  >
                    <AvatarFace skin={skin} hair={hair} />
                  </span>
                ))}
              </div>
              <p className="text-body-sm font-medium text-foreground">
                Join 48K+ users
                <br />
                worldwide
              </p>
            </div>
          </div>

          <div className="relative rounded-xl border-2 border-border bg-card shadow-brutal-lg">
            <div className="flex items-center justify-between rounded-t-[calc(var(--radius-xl)-2px)] border-b-2 border-border bg-brand-400 px-4 py-2">
              <p className="font-mono text-body-sm font-bold text-white">verity.exe</p>
              <div className="flex items-center gap-1.5 text-white">
                <Minus className="size-3" aria-hidden />
                <Square className="size-2.5" aria-hidden />
                <X className="size-3" aria-hidden />
              </div>
            </div>
            <div className="relative h-[30rem] overflow-hidden rounded-b-[calc(var(--radius-xl)-2px)]">
              <div className="absolute inset-x-0 bottom-0 h-2/3">
                <CitySkyline />
              </div>
              <span
                aria-hidden
                className="absolute top-10 left-16 flex size-14 items-center justify-center rounded-lg border-2 border-border bg-lime-300 shadow-brutal-sm"
              >
                <Asterisk className="size-7 text-foreground" strokeWidth={2.5} aria-hidden />
              </span>
            </div>
            {/* Positioned outside the overflow-hidden content area so the cards
                can hang past the window's right border, like the reference. */}
            <div className="absolute top-14 -right-5 flex w-40 flex-col gap-2.5">
              <StatCard bg="bg-pink-300" value="12K+" label="Startups Tracked" />
              <StatCard bg="bg-card" value="2K+" label="Open Internships" />
              <StatCard bg="bg-butter-300" value="85+" label="Countries Covered" />
              <StatCard bg="bg-brand-300" value="100%" label="Verified Data" />
            </div>
          </div>
        </div>
        <DotGrid className="absolute right-0 bottom-0 h-32 w-40" />
      </section>

      {/* Trusted by */}
      <section className="border-y-2 border-border bg-lime-200">
        <div className="mx-auto flex max-w-wide flex-wrap items-center gap-x-10 gap-y-4 px-4 py-6 sm:px-6">
          <span className="inline-flex items-center rounded-sm border-2 border-border bg-card px-3 py-1 text-overline text-foreground">
            TRUSTED BY
          </span>
          {TRUSTED_BY.map((name) => (
            <span key={name} className="font-display text-h4 font-bold text-foreground">
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* Feature cards */}
      <section className="mx-auto max-w-wide px-4 py-20 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, bg, title, description }) => (
            <div
              key={title}
              className="rounded-xl border-2 border-border bg-card p-6 shadow-brutal-sm"
            >
              <div className={`flex size-12 items-center justify-center rounded-lg border-2 border-border ${bg}`}>
                <Icon className="size-6 text-foreground" strokeWidth={1.75} aria-hidden />
              </div>
              <p className="mt-4 font-display text-h4 font-bold text-foreground">{title}</p>
              <p className="mt-2 text-body-sm text-foreground/70">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-wide px-4 py-20 sm:px-6">
        <h2 className="flex items-center justify-center gap-2 text-center font-display text-h1 font-bold text-foreground">
          How Verity works
          <Sparkle className="size-6 text-brand-400" aria-hidden />
        </h2>
        <div className="mt-12 flex flex-col gap-6 md:flex-row md:items-start">
          {STEPS.map(({ number, badge, icon: Icon, title, description, notification }, i) => (
            <Fragment key={title}>
              <div className="relative flex-1 rounded-xl border-2 border-border bg-card p-6 text-center shadow-brutal-sm">
                <div className="flex items-center justify-center gap-3">
                  <span
                    className={`flex size-8 items-center justify-center rounded-md border-2 border-border font-display font-bold text-foreground ${badge}`}
                  >
                    {number}
                  </span>
                </div>
                <div className="relative mx-auto mt-4 flex size-16 items-center justify-center rounded-xl border-2 border-border bg-card">
                  <Icon className="size-8 text-foreground" strokeWidth={1.5} aria-hidden />
                  {notification && (
                    <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full border-2 border-border bg-pink-300 text-[0.6875rem] font-bold text-foreground">
                      1
                    </span>
                  )}
                </div>
                <p className="mt-4 font-display text-h4 font-bold text-foreground">{title}</p>
                <p className="mt-2 text-body-sm text-foreground/70">{description}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  aria-hidden
                  className="mt-[2.35rem] hidden w-6 shrink-0 border-t-2 border-dashed border-border md:block"
                />
              )}
            </Fragment>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button size="lg" className="bg-lime-300 text-foreground hover:bg-lime-200" render={<Link href="/companies" />}>
            Explore Startups
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </section>

      {/* Bottom stat bar */}
      <section className="border-t-2 border-border bg-brand-400">
        <div className="mx-auto grid max-w-wide grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4">
          {[
            { icon: Globe, value: "12K+", label: "Startups Tracked" },
            { icon: Briefcase, value: "2K+", label: "Open Internships Tracked" },
            { icon: Users, value: "85+", label: "Countries Covered" },
            { icon: Star, value: "4.8/5", label: "Loved by Users" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border-2 border-border bg-card">
                <Icon className="size-5 text-foreground" strokeWidth={1.75} aria-hidden />
              </span>
              <div>
                <p className="font-display text-h3 font-bold text-white">{value}</p>
                <p className="text-caption text-white/80">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
