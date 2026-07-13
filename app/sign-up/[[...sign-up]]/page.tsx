import { SignUp } from "@clerk/nextjs";

import { AuthShell } from "@/components/shared/AuthShell";
import { clerkRetroAppearance } from "@/components/lib/clerk-appearance";

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
      <SignUp appearance={clerkRetroAppearance} fallbackRedirectUrl="/dashboard" />
    </AuthShell>
  );
}
