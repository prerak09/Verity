"use client";

import { useUser, SignInButton } from "@clerk/nextjs";

/**
 * Wraps an action that requires sign-in. Logged-out users get Clerk's sign-in
 * MODAL (a popup) when they click; logged-in users pass straight through to the
 * real control. Keeps discovery public while gating apply/bookmark/track.
 *
 * Usage:
 *   <SignInGate fallbackLabel="Sign in to apply">
 *     <RealActionButton />
 *   </SignInGate>
 *
 * `children` is the real control shown to signed-in users. `trigger` is what the
 * signed-out user clicks (defaults to a button styled like the real one).
 */
export function SignInGate({
  children,
  trigger,
  redirectUrl,
}: {
  children: React.ReactNode;
  /** The clickable element shown to logged-out users (opens the sign-in modal). */
  trigger: React.ReactNode;
  redirectUrl?: string;
}) {
  const { isLoaded, isSignedIn } = useUser();

  // While Clerk loads, render the signed-out trigger so nothing flashes/breaks.
  if (isLoaded && isSignedIn) return <>{children}</>;

  return (
    <SignInButton
      mode="modal"
      forceRedirectUrl={redirectUrl}
      signUpForceRedirectUrl={redirectUrl}
    >
      {trigger}
    </SignInButton>
  );
}
