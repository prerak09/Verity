import Link from "next/link";
import { ShieldCheck, Users, Briefcase, BadgeCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

const QUESTIONS = [
  {
    icon: ShieldCheck,
    title: "Company Intelligence",
    question: "Is this company legitimate, funded, and actually hiring?",
    description:
      "Funding stage, headcount, remote policy, and verification status — the due-diligence students used to skip because it took too long.",
  },
  {
    icon: Users,
    title: "Founder & People Intelligence",
    question: "Who works here, who founded it, and who do I talk to?",
    description:
      "Founders and hiring managers, listed by name, with the profiles LinkedIn buries behind an algorithm.",
  },
  {
    icon: Briefcase,
    title: "Internship Discovery & Tracking",
    question: "What does the role look like, and how do I track my application?",
    description:
      "Every open internship in one place, plus a tracker that follows your application from Saved to Offer.",
  },
];

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b-2 border-border bg-muted">
        <div className="mx-auto grid max-w-wide gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-28">
          <div>
            <p className="text-overline text-brand-700">
              CAREER INTELLIGENCE PLATFORM
            </p>
            <h1 className="mt-3 text-display-lg text-foreground sm:text-display-xl">
              Know a company before you apply.
            </h1>
            <p className="mt-5 max-w-prose text-body-lg text-muted-foreground">
              Crunchbase&apos;s rigor, LinkedIn&apos;s people-graph, and
              Linear&apos;s craft — applied to the internship search. Every
              company on Verity is manually verified. No scraping, no AI
              guesswork.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" render={<Link href="/sign-up" />}>
                Get started
              </Button>
              <Button
                variant="outline"
                size="lg"
                render={<Link href="/companies" />}
              >
                Browse companies
              </Button>
            </div>
          </div>

          <div className="rounded-xl border-2 border-border bg-card p-5 shadow-brutal-lg">
            <div className="flex items-center gap-3 border-b border-border-subtle pb-4">
              <span
                aria-hidden
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border-2 shadow-brutal-xs"
                style={{
                  background: "var(--verified-fill)",
                  borderColor: "var(--verified-ring)",
                }}
              >
                <BadgeCheck className="size-5 text-white" strokeWidth={3} aria-hidden />
              </span>
              <div>
                <p className="font-display text-h4 text-foreground">Ledgerly</p>
                <p className="text-body-sm text-muted-foreground">
                  Payments infrastructure &middot; Series B
                </p>
              </div>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-y-3 text-body-sm">
              <dt className="text-muted-foreground">Founders</dt>
              <dd className="text-right font-medium text-foreground">2 listed</dd>
              <dt className="text-muted-foreground">Remote policy</dt>
              <dd className="text-right font-medium text-foreground">Hybrid</dd>
              <dt className="text-muted-foreground">Open internships</dt>
              <dd className="text-right font-medium text-foreground">3 roles</dd>
              <dt className="text-muted-foreground">Last verified</dt>
              <dd className="text-right font-medium text-foreground">This week</dd>
            </dl>
          </div>
        </div>
      </section>

      {/* Three questions */}
      <section className="mx-auto max-w-wide px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <h2 className="text-h1 text-foreground">
            A job board answers what&apos;s open. Verity answers what students
            actually ask.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {QUESTIONS.map(({ icon: Icon, title, question, description }) => (
            <div
              key={title}
              className="rounded-xl border-2 border-border bg-card p-6 shadow-brutal-sm"
            >
              <div className="flex size-11 items-center justify-center rounded-lg border-2 border-border bg-brand-50">
                <Icon className="size-5 text-brand-700" strokeWidth={1.75} aria-hidden />
              </div>
              <p className="mt-4 text-overline text-muted-foreground">
                {title}
              </p>
              <p className="mt-2 font-display text-h4 text-foreground">
                &ldquo;{question}&rdquo;
              </p>
              <p className="mt-2 text-body-sm text-muted-foreground">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust / verification */}
      <section className="border-y-2 border-border bg-muted">
        <div className="mx-auto grid max-w-wide gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-overline text-brand-700">HOW VERIFICATION WORKS</p>
            <h2 className="mt-3 text-h1 text-foreground">
              The verified badge means something because it&apos;s rare.
            </h2>
            <p className="mt-4 max-w-prose text-body text-muted-foreground">
              Every company profile is entered by the company itself and
              checked by an Admin before it goes live — domain ownership,
              funding claims, and open roles included. Nothing is scraped,
              nothing is AI-generated. If a badge is on the page, a person
              looked at it.
            </p>
          </div>
          <div className="flex items-center gap-4 rounded-xl border-2 border-border bg-card p-6 shadow-brutal-md">
            <span
              aria-hidden
              className="inline-flex size-12 shrink-0 items-center justify-center rounded-md border-2 shadow-brutal-sm"
              style={{
                background: "var(--verified-fill)",
                borderColor: "var(--verified-ring)",
              }}
            >
              <BadgeCheck className="size-6 text-white" strokeWidth={3} aria-hidden />
            </span>
            <p className="text-body-sm text-muted-foreground">
              This exact badge appears nowhere else in the product — not on
              buttons, not on filters — so it can never be confused with an
              ordinary UI element.
            </p>
          </div>
        </div>
      </section>

      {/* Dual CTA */}
      <section className="mx-auto max-w-wide px-4 py-20 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border-2 border-border bg-card p-8 shadow-brutal-sm">
            <p className="text-overline text-muted-foreground">FOR STUDENTS</p>
            <h3 className="mt-2 font-display text-h2 text-foreground">
              Search is free, always.
            </h3>
            <p className="mt-2 text-body-sm text-muted-foreground">
              Bookmark companies, track applications from Saved to Offer, and
              stop re-researching the same company twice.
            </p>
            <Button className="mt-6" render={<Link href="/sign-up" />}>
              Get started
            </Button>
          </div>
          <div className="rounded-xl border-2 border-border bg-card p-8 shadow-brutal-sm">
            <p className="text-overline text-muted-foreground">FOR COMPANIES</p>
            <h3 className="mt-2 font-display text-h2 text-foreground">
              Claim your profile.
            </h3>
            <p className="mt-2 text-body-sm text-muted-foreground">
              An unclaimed, unverified profile is a missed hire. Self-serve
              verification, no Admin bottleneck.
            </p>
            <Button
              className="mt-6"
              variant="outline"
              render={<Link href="/sign-up" />}
            >
              Register your company
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
