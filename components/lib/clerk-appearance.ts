/** Retro verity.exe appearance for Clerk's <SignIn>/<SignUp> components. */
export const clerkRetroAppearance = {
  variables: {
    colorPrimary: "#7C3AED",
    colorText: "#0A0A09",
    colorBackground: "#FFFFFF",
    borderRadius: "3px",
    fontFamily: "var(--font-mono)",
  },
  elements: {
    rootBox: "w-full",
    card: "shadow-none border-0 bg-transparent p-0 w-full",
    headerTitle: "font-display font-bold text-2xl text-neutral-950",
    headerSubtitle: "font-mono text-sm text-neutral-600",
    socialButtonsBlockButton:
      "border-[3px] border-neutral-950 rounded-[3px] font-mono font-bold [box-shadow:3px_3px_0_0_var(--color-neutral-950)]",
    formFieldInput:
      "border-[3px] border-neutral-950 rounded-[3px] font-mono h-11",
    formFieldLabel: "font-mono font-bold text-neutral-950",
    formButtonPrimary:
      "bg-lime text-neutral-950 border-[3px] border-neutral-950 rounded-[3px] font-mono font-bold [box-shadow:3px_3px_0_0_var(--color-neutral-950)] hover:bg-[#B9EC2E]",
    footerActionLink: "text-primary font-mono font-bold",
    dividerLine: "bg-neutral-300",
    dividerText: "font-mono text-neutral-500",
  },
} as const;
