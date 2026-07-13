import Link from "next/link";
import { Compass } from "lucide-react";

import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";

/**
 * Root 404 (TRD §21). Rendered for any unmatched path once the middleware
 * stopped force-redirecting unknown routes to sign-in. Ships its own minimal
 * chrome because it renders at the root, outside any route-group layout.
 */
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b-[3px] border-neutral-950 bg-[#EFF3D2]">
        <div className="mx-auto flex max-w-wide items-center px-4 py-4 sm:px-6">
          <Logo />
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-24 text-center">
        <div className="flex size-16 items-center justify-center rounded-[4px] border-[3px] border-neutral-950 bg-tile-lavender shadow-brutal-sm">
          <Compass className="size-8 text-neutral-950" strokeWidth={1.75} aria-hidden />
        </div>
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-neutral-700">
            Error 404
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold text-neutral-950">
            Page not found
          </h1>
          <p className="mt-2 max-w-md font-mono text-sm text-neutral-700">
            The page you&apos;re looking for doesn&apos;t exist or may have moved.
            Let&apos;s get you back on track.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button render={<Link href="/" />}>Go home</Button>
          <Button variant="outline" render={<Link href="/companies" />}>
            Browse startups
          </Button>
        </div>
      </main>
    </div>
  );
}
