import { SignIn } from "@clerk/nextjs";

import { AuthShell } from "@/components/shared/AuthShell";
import { clerkRetroAppearance } from "@/components/lib/clerk-appearance";

export default function SignInPage() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Good to see you again."
      titleAccent="Let's build what's next."
      subtitle="Log in to continue discovering verified startups, exploring opportunities, and connecting with the right people."
      testimonial={{
        quote:
          "Verity is my go-to platform for finding trusted startups and valuable insights. It just works.",
        name: "Rohan S.",
        role: "Growth Manager",
      }}
    >
      <SignIn appearance={clerkRetroAppearance} />
    </AuthShell>
  );
}
