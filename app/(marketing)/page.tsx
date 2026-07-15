import Link from "next/link";
import {
  Search,
  BadgeCheck,
  Bookmark,
  ArrowRight,
  Play,
  Users,
  Mail,
  Building2,
  GraduationCap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { WindowChrome } from "@/components/shared/WindowChrome";
import { StatTile } from "@/components/shared/StatTile";
import { CompanyLogo } from "@/components/shared/CompanyLogo";
import { PostingCard } from "@/components/shared/PostingCard";
import { HorizontalCarousel } from "@/components/shared/HorizontalCarousel";
import { getPostingsOfTheDay } from "@/features/internships/queries";
import {
  getPlatformStats,
  getFeaturedLogos,
  type PlatformStats,
  type FeaturedLogo,
} from "@/features/stats/queries";
import type { PostingOfTheDay } from "@/types";

/** "1,240" for small numbers; "12K+" once it's worth rounding. Never inflates. */
function formatCount(n: number): string {
  if (n >= 1000) return `${Math.floor(n / 1000)}K+`;
  if (n >= 100) return `${Math.floor(n / 100) * 100}+`;
  return String(n);
}

const FEATURES = [
  {
    icon: BadgeCheck,
    tile: "bg-tile-lavender",
    title: "Manually verified",
    body: "Every company is checked by a human before it appears — no scraped listings, no ghost roles.",
  },
  {
    icon: Search,
    tile: "bg-tile-yellow",
    title: "Real open roles",
    body: "Internships and jobs pulled straight from verified startups, split cleanly by season and type.",
  },
  {
    icon: Bookmark,
    tile: "bg-tile-lime",
    title: "Track it all",
    body: "Bookmark companies, save roles, and follow every application from saved to offer in one place.",
  },
];

const STEPS = [
  {
    n: "1",
    icon: Search,
    title: "Discover",
    body: "Browse verified startups and filter open roles by category, season, and remote policy.",
  },
  {
    n: "2",
    icon: Users,
    title: "Verify",
    body: "We confirm every company, founder, and role so you never chase a listing that isn't real.",
  },
  {
    n: "3",
    icon: Mail,
    title: "Apply",
    body: "Apply on the company's own site and track where each application stands from your dashboard.",
  },
];

export const revalidate = 300;

export default async function LandingPage() {
  let stats: PlatformStats = {
    verifiedCompanies: 0,
    openInternships: 0,
    totalStudents: 0,
    countries: 0,
  };
  let logos: FeaturedLogo[] = [];
  let postings: PostingOfTheDay[] = [];

  try {
    const [s, l, p] = await Promise.all([
      getPlatformStats(),
      getFeaturedLogos(12),
      getPostingsOfTheDay(8),
    ]);
    stats = s;
    logos = l;
    postings = p;
  } catch {
    // DB unreachable — hero renders with zeros and the thin sections hide below.
  }

  const showLogos = logos.length >= 6;
  const showPostings = postings.length >= 3;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="mx-auto grid max-w-wide items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div>
          <span className="retro-eyebrow">Verified Startup Intelligence</span>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[0.98] tracking-tight text-neutral-950 sm:text-6xl">
            Discover.
            <br />
            Verify.
            <br />
            <span className="mt-2 inline-block rounded-[4px] border-[3px] border-neutral-950 bg-primary px-3 py-1 text-primary-foreground [box-shadow:4px_4px_0_0_var(--color-neutral-950)]">
              Connect.
            </span>
          </h1>
          <p className="mt-7 max-w-md font-mono text-[15px] leading-relaxed text-neutral-700">
            Verity is the trust layer for startup careers — discover manually
            verified startups, explore their real open internships and jobs, and
            track every application in one place.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" render={<Link href="/companies" />}>
              Explore startups <ArrowRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              render={<Link href="/internships" />}
            >
              Browse internships <Play className="size-3.5" />
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-sm text-neutral-700">
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck className="size-4 text-brand-700" strokeWidth={2.25} aria-hidden />
              100% human-verified
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="size-4 text-brand-700" strokeWidth={2.25} aria-hidden />
              {formatCount(stats.verifiedCompanies)} startups
            </span>
            <span className="inline-flex items-center gap-1.5">
              <GraduationCap className="size-4 text-brand-700" strokeWidth={2.25} aria-hidden />
              {formatCount(stats.openInternships)} open roles
            </span>
          </div>
        </div>

        {/* verity.exe window with pixel city + two real stat tiles */}
        <WindowChrome title="verity.exe" bodyClassName="p-4">
          <div className="grid gap-4 sm:grid-cols-[1.3fr_1fr]">
            <div className="relative flex items-center justify-center overflow-hidden rounded-[3px] border-[3px] border-neutral-950 bg-neutral-950 p-6">
              <PixelCity />
              <span
                aria-hidden
                className="absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-[3px] border-[3px] border-neutral-950 bg-lime font-pixel text-lg text-neutral-950"
              >
                *
              </span>
            </div>
            <div className="grid gap-3">
              <StatTile
                value={formatCount(stats.verifiedCompanies)}
                label="Verified Startups"
                color="pink"
              />
              <StatTile
                value={formatCount(stats.openInternships)}
                label="Open Roles"
                color="mint"
              />
              <StatTile value="100%" label="Human-Verified" color="lavender" />
            </div>
          </div>
        </WindowChrome>
      </section>

      {/* ── Verified company strip ───────────────────────────────────── */}
      {showLogos && (
        <section className="mx-auto max-w-wide px-4 pb-8 sm:px-6">
          <div className="rounded-[4px] border-[3px] border-neutral-950 bg-[#EBEFD0] px-6 py-5">
            <span className="retro-eyebrow bg-card">Verified on Verity</span>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              {logos.map((c) => (
                <Link
                  key={c.slug}
                  href={`/companies/${c.slug}`}
                  className="rounded-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  title={c.name}
                >
                  <CompanyLogo
                    src={c.logoUrl}
                    name={c.name}
                    seed={c.slug}
                    size={48}
                    className="transition-transform hover:-translate-y-0.5"
                  />
                  <span className="sr-only">{c.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Postings of the day ──────────────────────────────────────── */}
      {showPostings && (
        <section className="mx-auto max-w-wide px-4 py-10 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="retro-eyebrow">Postings of the Day</span>
              <h2 className="mt-3 font-display text-3xl font-bold text-neutral-950">
                Hand-picked opportunities worth your attention
              </h2>
            </div>
            <Link
              href="/internships"
              className="inline-flex shrink-0 items-center gap-1 font-mono text-sm font-medium text-neutral-800 hover:underline"
            >
              View all <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
          <HorizontalCarousel className="mt-6">
            {postings.map((posting) => (
              <PostingCard key={posting.id} posting={posting} />
            ))}
          </HorizontalCarousel>
        </section>
      )}

      {/* ── Feature cards ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-wide px-4 py-12 sm:px-6">
        <h2 className="sr-only">What Verity offers</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, tile, title, body }) => (
            <div key={title} className="retro-card retro-hover p-6">
              <span
                className={`inline-flex size-12 items-center justify-center rounded-[3px] border-[3px] border-neutral-950 ${tile}`}
              >
                <Icon className="size-5 text-neutral-950" strokeWidth={2.25} aria-hidden />
              </span>
              <h3 className="mt-5 font-display text-lg font-bold text-neutral-950">
                {title}
              </h3>
              <p className="mt-3 font-mono text-sm leading-relaxed text-neutral-700">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How Verity works ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-wide px-4 py-10 sm:px-6">
        <h2 className="text-center font-display text-4xl font-bold text-neutral-950">
          How Verity works
        </h2>
        <div className="relative mt-12 grid gap-6 md:grid-cols-3">
          {STEPS.map(({ n, icon: Icon, title, body }) => (
            <div key={n} className="retro-card relative p-6 pt-8 text-center">
              <span className="absolute -top-4 left-6 inline-flex size-8 items-center justify-center rounded-[3px] border-[3px] border-neutral-950 bg-tile-lavender font-display text-sm font-bold text-neutral-950">
                {n}
              </span>
              <span className="mx-auto inline-flex size-14 items-center justify-center rounded-[3px] border-[3px] border-neutral-950 bg-card">
                <Icon className="size-6 text-neutral-950" strokeWidth={2} aria-hidden />
              </span>
              <h3 className="mt-4 font-display text-xl font-bold text-neutral-950">
                {title}
              </h3>
              <p className="mt-2 font-mono text-sm leading-relaxed text-neutral-700">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Closing CTA band ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-wide px-4 py-14 sm:px-6">
        <div className="rounded-[4px] border-[3px] border-neutral-950 bg-primary p-8 text-center [box-shadow:6px_6px_0_0_var(--color-neutral-950)] sm:p-12">
          <h2 className="font-display text-3xl font-bold text-primary-foreground sm:text-4xl">
            Start discovering — free
          </h2>
          <p className="mx-auto mt-3 max-w-lg font-mono text-sm leading-relaxed text-primary-foreground/90">
            Create a free account to bookmark startups, save roles, and track
            your applications. Hiring? List your startup and reach students who
            want to work at verified companies.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              variant="secondary"
              render={<Link href="/sign-up" />}
            >
              <GraduationCap className="size-4" /> Join as a student
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground bg-transparent text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              render={<Link href="/company-onboarding" />}
            >
              <Building2 className="size-4" /> List your startup
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

/** Simple CSS pixel-art skyline for the hero window. */
function PixelCity() {
  return (
    <svg
      viewBox="0 0 120 90"
      className="pixelated h-40 w-full text-neutral-200"
      shapeRendering="crispEdges"
      aria-hidden
    >
      <g fill="currentColor">
        <rect x="6" y="40" width="18" height="46" />
        <rect x="28" y="24" width="20" height="62" />
        <rect x="52" y="52" width="14" height="34" />
        <rect x="70" y="14" width="20" height="72" />
        <rect x="94" y="34" width="18" height="52" />
      </g>
      <g fill="#0A0A09">
        {/* windows */}
        <rect x="10" y="46" width="4" height="4" />
        <rect x="16" y="46" width="4" height="4" />
        <rect x="10" y="56" width="4" height="4" />
        <rect x="16" y="56" width="4" height="4" />
        <rect x="32" y="30" width="4" height="4" />
        <rect x="40" y="30" width="4" height="4" />
        <rect x="32" y="42" width="4" height="4" />
        <rect x="40" y="42" width="4" height="4" />
        <rect x="74" y="20" width="4" height="4" />
        <rect x="82" y="20" width="4" height="4" />
        <rect x="74" y="32" width="4" height="4" />
        <rect x="82" y="32" width="4" height="4" />
        <rect x="98" y="40" width="4" height="4" />
        <rect x="106" y="40" width="4" height="4" />
      </g>
    </svg>
  );
}
