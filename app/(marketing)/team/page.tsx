import type { Metadata } from "next";
import Link from "next/link";
import {
  Target,
  ShieldCheck,
  Users,
  Zap,
  Lightbulb,
  Code2,
  TrendingUp,
  Heart,
  Rocket,
  ExternalLink,
  ArrowRight,
  UserCircle,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { WindowChrome } from "@/components/shared/WindowChrome";
import { cn } from "@/components/lib/utils";

export const metadata: Metadata = {
  title: "Team",
  description: "Meet the team behind Verity.",
};

interface Founder {
  badge: string;
  name: string;
  title: string;
  school: string;
  bio: string;
  linkedin: string;
  github: string;
}

const FOUNDERS: Founder[] = [
  {
    badge: "FOUNDER",
    name: "Vishakha Yadav",
    title: "Founder & CEO",
    school: "IIIT Delhi",
    bio: "Passionate about solving real problems with technology and building products that create real impact.",
    linkedin: "https://www.linkedin.com/in/vishakhasyadav/",
    github: "https://github.com/Vishakhayadavv",
  },
  {
    badge: "CO-FOUNDER",
    name: "Prerak Tanwar",
    title: "Co-Founder & CTO",
    school: "IIIT Delhi",
    bio: "Loves building scalable systems, clean code and turning complex ideas into simple, powerful products.",
    linkedin: "https://www.linkedin.com/in/preraktanwar/",
    github: "https://github.com/prerak09",
  },
];

const VALUES: { icon: LucideIcon; tile: string; title: string; body: string }[] = [
  {
    icon: Target,
    tile: "bg-tile-lime",
    title: "Purpose First",
    body: "We build with purpose to make a real difference.",
  },
  {
    icon: ShieldCheck,
    tile: "bg-tile-lavender",
    title: "Trust & Accuracy",
    body: "We verify everything so you can trust what you see.",
  },
  {
    icon: Users,
    tile: "bg-tile-yellow",
    title: "Builders at Heart",
    body: "We're students, just like you — building for builders.",
  },
  {
    icon: Zap,
    tile: "bg-tile-lime",
    title: "Move Fast",
    body: "We ship fast, learn faster and keep improving every day.",
  },
];

const STORY: { icon: LucideIcon; tile: string; badge: string; title: string; body: string }[] = [
  {
    icon: Lightbulb,
    tile: "bg-tile-lavender",
    badge: "2026",
    title: "It started with a simple idea",
    body: "We were frustrated with scattered and unreliable startup data.",
  },
  {
    icon: Code2,
    tile: "bg-tile-lime",
    badge: "Built Verity",
    title: "We built Verity",
    body: "To verify, organize and make startup intelligence accessible for all.",
  },
  {
    icon: TrendingUp,
    tile: "bg-tile-lavender",
    badge: "1000+",
    title: "1000+ startups indexed",
    body: "Growing every day with verified data and insights.",
  },
  {
    icon: Heart,
    tile: "bg-tile-lime",
    badge: "Our Community",
    title: "Trusted by students & builders",
    body: "Helping thousands discover opportunities that matter.",
  },
  {
    icon: Rocket,
    tile: "bg-tile-lavender",
    badge: "The Future",
    title: "And this is just the beginning",
    body: "We're building the future of startup intelligence.",
  },
];

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span aria-hidden className="size-3 rounded-[2px] border-2 border-neutral-950 bg-lime" />
      <h2 className="font-display text-2xl font-bold text-neutral-950">{children}</h2>
      <span aria-hidden className="h-px flex-1 border-t-2 border-dashed border-neutral-950/25" />
    </div>
  );
}

export default function TeamPage() {
  return (
    <div className="mx-auto max-w-wide px-4 py-12 sm:px-6">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="grid items-center gap-12 lg:grid-cols-[1fr_1fr]">
        <div>
          <span className="retro-eyebrow">Our Team</span>
          <h1 className="mt-4 font-display text-5xl font-bold leading-[1.05] text-neutral-950">
            The team behind
            <br />
            <span className="underline decoration-primary decoration-[6px] underline-offset-[10px]">
              Verity.
            </span>
          </h1>
          <p className="mt-6 max-w-md font-mono text-[15px] leading-relaxed text-neutral-700">
            We&apos;re a group of builders, researchers and dreamers on a
            mission to make startup information verified, accessible and
            useful for everyone. Built by students, for students and the
            builders of tomorrow.
          </p>
        </div>

        <WindowChrome title="team.exe">
          <div className="grid grid-cols-2 gap-3">
            {FOUNDERS.map((f) => (
              <div
                key={f.name}
                className="flex flex-col items-center gap-2 rounded-[3px] border-[3px] border-neutral-950 bg-tile-lavender p-4"
              >
                <UserCircle className="size-12 text-neutral-950" strokeWidth={1.5} aria-hidden />
                <p className="text-center font-display text-sm font-bold text-neutral-950">
                  {f.name}
                </p>
              </div>
            ))}
            <div className="col-span-2 flex items-center justify-center gap-2 rounded-[3px] border-[3px] border-neutral-950 bg-card p-4 font-mono text-sm font-bold text-neutral-800">
              <Sparkles className="size-4 text-primary" aria-hidden />
              Verified startup intelligence
            </div>
          </div>
        </WindowChrome>
      </section>

      {/* ── Founders ─────────────────────────────────────────────────── */}
      <section className="mt-20">
        <SectionHeading>Meet the Co-Founders</SectionHeading>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {FOUNDERS.map((f) => (
            <div key={f.name} className="retro-card p-6">
              <span className="retro-eyebrow bg-lime">{f.badge}</span>
              <div className="mt-4 flex items-start gap-4">
                <span className="grid size-20 shrink-0 place-items-center rounded-[3px] border-[3px] border-neutral-950 bg-tile-lavender">
                  <UserCircle className="size-11 text-neutral-950" strokeWidth={1.5} aria-hidden />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-bold text-neutral-950">{f.name}</h3>
                  <p className="font-mono text-sm font-bold text-primary">{f.title}</p>
                  <p className="mt-0.5 font-mono text-sm text-neutral-700">{f.school}</p>
                </div>
              </div>
              <p className="mt-4 border-t-2 border-dashed border-neutral-950/15 pt-4 text-body-sm text-neutral-700">
                {f.bio}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="gap-1.5" render={<Link href={f.linkedin} target="_blank" rel="noreferrer" />}>
                  LinkedIn
                  <ExternalLink className="size-3.5" aria-hidden />
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5" render={<Link href={f.github} target="_blank" rel="noreferrer" />}>
                  GitHub
                  <ExternalLink className="size-3.5" aria-hidden />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────────── */}
      <section className="mt-20">
        <SectionHeading>What drives us</SectionHeading>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v) => (
            <div key={v.title} className="retro-card retro-hover p-4">
              <span
                className={cn(
                  "grid size-11 place-items-center rounded-[3px] border-[3px] border-neutral-950",
                  v.tile,
                )}
              >
                <v.icon className="size-5 text-neutral-950" aria-hidden />
              </span>
              <h3 className="mt-3 font-display text-base font-bold text-neutral-950">
                {v.title}
              </h3>
              <p className="mt-1 text-body-sm text-neutral-700">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Story ────────────────────────────────────────────────────── */}
      <section className="mt-20">
        <SectionHeading>Our Story</SectionHeading>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {STORY.map((s) => (
            <div key={s.title} className="flex flex-col items-center text-center">
              <span
                className={cn(
                  "grid size-14 place-items-center rounded-[3px] border-[3px] border-neutral-950",
                  s.tile,
                )}
              >
                <s.icon className="size-6 text-neutral-950" aria-hidden />
              </span>
              <span className="retro-eyebrow mt-3 bg-lime">{s.badge}</span>
              <h3 className="mt-3 font-display text-sm font-bold text-neutral-950">
                {s.title}
              </h3>
              <p className="mt-1.5 text-caption text-neutral-700">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section className="mt-20 rounded-[4px] border-[3px] border-neutral-950 bg-tile-lavender p-8 [box-shadow:6px_6px_0_0_var(--color-neutral-950)] sm:p-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <h2 className="max-w-lg font-display text-2xl font-bold text-neutral-950 sm:text-3xl">
            Join us in building the future of startup intelligence.
          </h2>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button size="lg" className="gap-1.5" render={<Link href="/companies" />}>
              Explore Startups <ArrowRight className="size-4" aria-hidden />
            </Button>
            <Button variant="outline" size="lg" render={<Link href="mailto:support@verity.example.com" />}>
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
