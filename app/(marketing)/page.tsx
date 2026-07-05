import Link from "next/link";
import {
  Search,
  Zap,
  Mail,
  Bookmark,
  ArrowRight,
  Play,
  Globe,
  Briefcase,
  Users,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { WindowChrome } from "@/components/shared/WindowChrome";
import { StatTile } from "@/components/shared/StatTile";

const FEATURES = [
  {
    icon: Search,
    tile: "bg-tile-lavender",
    title: "Verified Data",
    body: "We verify every detail so you can trust what you see.",
  },
  {
    icon: Zap,
    tile: "bg-tile-yellow",
    title: "Live Insights",
    body: "Stay updated with the latest hiring signals and company news.",
  },
  {
    icon: Mail,
    tile: "bg-tile-pink",
    title: "Smart Outreach",
    body: "Personalized emails that help you stand out and get replies.",
  },
  {
    icon: Bookmark,
    tile: "bg-tile-lime",
    title: "Track Everything",
    body: "Save, organize, and track your applications in one place.",
  },
];

const STEPS = [
  {
    n: "1",
    icon: Search,
    title: "Discover",
    body: "Search and filter startups using 20+ smart filters to find the right ones.",
  },
  {
    n: "2",
    icon: Users,
    title: "Verify",
    body: "We collect and verify company, founder, and hiring information.",
  },
  {
    n: "3",
    icon: Mail,
    title: "Connect",
    body: "Get personalized email templates and build meaningful connections.",
  },
];

const TRUSTED = ["Google for Startups", "Y Combinator", "techstars_", "ANTLER", "Startmate"];

const FOOTER_STATS = [
  { icon: Globe, value: "12K+", label: "Startups Tracked" },
  { icon: Briefcase, value: "2K+", label: "Open Internships" },
  { icon: Users, value: "85+", label: "Countries Covered" },
  { icon: Star, value: "4.8/5", label: "Loved by Users" },
];

export default function LandingPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="mx-auto grid max-w-wide items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1fr] lg:py-20">
        <div>
          <span className="retro-eyebrow">Verified Startup Intelligence</span>
          <h1 className="mt-6 font-display text-6xl font-bold leading-[0.95] tracking-tight text-neutral-950 sm:text-7xl">
            Discover.
            <br />
            Verify.
            <br />
            <span className="mt-2 inline-block rounded-[4px] border-[3px] border-neutral-950 bg-primary px-3 py-1 text-primary-foreground [box-shadow:4px_4px_0_0_var(--color-neutral-950)]">
              Connect.
            </span>
          </h1>
          <p className="mt-7 max-w-md font-mono text-[15px] leading-relaxed text-neutral-700">
            Verity helps users discover verified startups, explore open roles,
            and connect with the right people to grow their careers.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" render={<Link href="/companies" />}>
              Explore Startups <ArrowRight className="size-4" />
            </Button>
            <Button variant="outline" size="lg" render={<Link href="/sign-up" />}>
              See how it works <Play className="size-3.5" />
            </Button>
          </div>
          <div className="mt-8 flex items-center gap-3">
            <div className="flex -space-x-2">
              {["#F9C6D3", "#B9A9F5", "#FCE38A", "#A9C7F5", "#C4F542"].map((c) => (
                <span
                  key={c}
                  className="inline-block size-9 rounded-[3px] border-[3px] border-neutral-950"
                  style={{ background: c }}
                  aria-hidden
                />
              ))}
            </div>
            <p className="font-mono text-sm font-medium text-neutral-800">
              Join 48K+ users
              <br />
              worldwide
            </p>
          </div>
        </div>

        {/* verity.exe window with pixel city + stat tiles */}
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
              <StatTile value="12K+" label="Startups Tracked" color="pink" />
              <StatTile value="2K+" label="Open Internships" color="mint" />
              <StatTile value="85+" label="Countries Covered" color="yellow" />
              <StatTile value="100%" label="Verified Data" color="lavender" />
            </div>
          </div>
        </WindowChrome>
      </section>

      {/* ── Trusted by ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-wide px-4 pb-6 sm:px-6">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 rounded-[4px] border-[3px] border-neutral-950 bg-[#EBEFD0] px-6 py-5">
          <span className="retro-eyebrow bg-card">Trusted by</span>
          {TRUSTED.map((name) => (
            <span
              key={name}
              className="font-display text-lg font-bold text-neutral-900"
            >
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* ── Feature cards ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-wide px-4 py-14 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
        <div className="mt-10 flex justify-center">
          <Button size="lg" render={<Link href="/companies" />}>
            Explore Startups <ArrowRight className="size-4" />
          </Button>
        </div>
      </section>

      {/* ── Footer stat bar ──────────────────────────────────────────── */}
      <section className="mx-auto max-w-wide px-4 pb-16 sm:px-6">
        <div className="grid gap-4 rounded-[4px] border-[3px] border-neutral-950 bg-tile-lavender p-5 [box-shadow:6px_6px_0_0_var(--color-neutral-950)] sm:grid-cols-2 lg:grid-cols-4">
          {FOOTER_STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="inline-flex size-11 items-center justify-center rounded-[3px] border-[3px] border-neutral-950 bg-card">
                <Icon className="size-5 text-neutral-950" strokeWidth={2} aria-hidden />
              </span>
              <div>
                <div className="font-display text-2xl font-bold leading-none text-neutral-950 tabular">
                  {value}
                </div>
                <div className="mt-1 font-mono text-xs font-medium text-neutral-800">
                  {label}
                </div>
              </div>
            </div>
          ))}
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
