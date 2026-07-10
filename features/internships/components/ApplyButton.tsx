"use client";

import { useUser, SignInButton } from "@clerk/nextjs";
import { ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * "Apply" CTA. Discovery is public, but applying requires an account (user's
 * decision): logged-out users get Clerk's sign-in MODAL first; logged-in users
 * go straight to the company's external application page in a new tab.
 */
export function ApplyButton({ applyUrl }: { applyUrl: string }) {
  const { isLoaded, isSignedIn } = useUser();

  if (isLoaded && isSignedIn) {
    return (
      <Button
        className="mt-4 w-full"
        size="lg"
        render={<a href={applyUrl} target="_blank" rel="noopener noreferrer" />}
      >
        Apply on company site
        <ExternalLink className="size-4" aria-hidden />
      </Button>
    );
  }

  // Logged out → open the sign-in modal; after auth, send them to the apply URL.
  return (
    <SignInButton mode="modal" forceRedirectUrl={applyUrl} signUpForceRedirectUrl={applyUrl}>
      <Button className="mt-4 w-full" size="lg">
        Sign in to apply
        <ExternalLink className="size-4" aria-hidden />
      </Button>
    </SignInButton>
  );
}
