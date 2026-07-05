import { SignUp } from "@clerk/nextjs";

import { AuthShell } from "@/components/shared/AuthShell";
import { DemoAuthPanel } from "@/components/shared/DemoAuthPanel";
import { clerkRetroAppearance } from "@/components/lib/clerk-appearance";

const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export default function SignUpPage() {
  return (
    <AuthShell
      eyebrow="Welcome to Verity"
      title="Let's set up your account."
      titleAccent="You're one step closer."
      subtitle="Join thousands of users who trust Verity to discover verified startups, explore open roles, and connect with the right people to grow their careers."
      testimonial={{
        quote:
          "Verity helped me discover startups I never would have found. Landed an internship in 3 weeks!",
        name: "Ananya P.",
        role: "Product Designer",
      }}
    >
      {demoMode ? (
        <DemoAuthPanel mode="sign-up" />
      ) : (
        <SignUp appearance={clerkRetroAppearance} />
      )}
    </AuthShell>
  );
}
