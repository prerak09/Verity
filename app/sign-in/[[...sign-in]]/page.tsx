import { SignIn } from "@clerk/nextjs";

import { AuthShell } from "@/components/shared/AuthShell";

export default function SignInPage() {
  return (
    <AuthShell>
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#7C3AED",
            borderRadius: "0.75rem",
          },
          elements: {
            card: "border-2 border-border shadow-brutal-md",
          },
        }}
      />
    </AuthShell>
  );
}
