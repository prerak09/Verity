import { ShieldCheck, Zap, Users } from "lucide-react";

import { Logo } from "@/components/shared/Logo";
import { PixelMonitor } from "@/components/shared/PixelMonitor";

const BENEFITS = [
  {
    icon: ShieldCheck,
    tile: "bg-tile-lavender",
    title: "Verified & Trusted",
    body: "We verify every detail so you can trust what you see.",
  },
  {
    icon: Zap,
    tile: "bg-tile-yellow",
    title: "Save Time",
    body: "Stop researching manually. Get accurate info in seconds.",
  },
  {
    icon: Users,
    tile: "bg-tile-pink",
    title: "Better Connections",
    body: "Find the right people and opportunities that matter.",
  },
];

/**
 * Split-screen auth wrapper (CONTRACTS.md CR-3). Retro marketing panel on the
 * left (pixel CRT + benefits + testimonial), the Clerk form on the right.
 */
export function AuthShell({
  eyebrow,
  title,
  titleAccent,
  subtitle,
  testimonial,
  children,
}: {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  subtitle: string;
  testimonial: { quote: string; name: string; role: string };
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto grid w-full max-w-wide flex-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:items-start lg:gap-10 lg:py-14">
      {/* Left — marketing panel */}
      <aside className="retro-card flex flex-col gap-6 p-7">
        <span className="retro-eyebrow w-fit">{eyebrow}</span>
        <h1 className="font-display text-4xl font-bold leading-tight text-neutral-950">
          {title}
          {titleAccent && (
            <>
              {" "}
              <span className="text-primary">{titleAccent}</span>
            </>
          )}
        </h1>
        <p className="max-w-md font-mono text-sm leading-relaxed text-neutral-700">
          {subtitle}
        </p>

        <div className="rounded-[3px] border-[3px] border-dashed border-neutral-950 bg-card p-4">
          <PixelMonitor className="mx-auto h-40 w-auto" />
        </div>

        <ul className="flex flex-col gap-4">
          {BENEFITS.map(({ icon: Icon, tile, title: t, body }) => (
            <li key={t} className="flex gap-3">
              <span
                className={`inline-flex size-10 shrink-0 items-center justify-center rounded-[3px] border-[3px] border-neutral-950 ${tile}`}
              >
                <Icon className="size-5 text-neutral-950" strokeWidth={2.25} aria-hidden />
              </span>
              <div>
                <p className="font-display text-sm font-bold text-neutral-950">{t}</p>
                <p className="font-mono text-xs leading-relaxed text-neutral-700">{body}</p>
              </div>
            </li>
          ))}
        </ul>

        <blockquote className="rounded-[3px] border-[3px] border-neutral-950 bg-[#EBEFD0] p-4">
          <p className="font-mono text-sm leading-relaxed text-neutral-800">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
          <footer className="mt-3 flex items-center gap-2">
            <span className="size-8 rounded-[3px] border-2 border-neutral-950 bg-tile-lavender" aria-hidden />
            <span>
              <span className="block font-display text-sm font-bold text-neutral-950">
                {testimonial.name}
              </span>
              <span className="block font-mono text-xs text-neutral-600">{testimonial.role}</span>
            </span>
          </footer>
        </blockquote>
      </aside>

      {/* Right — form */}
      <div className="retro-card flex flex-col gap-5 p-7">
        <Logo className="lg:hidden" />
        {children}
      </div>
    </div>
  );
}
