import { Logo } from "@/components/shared/Logo";

/** Centered wrapper shared by /sign-in and /sign-up (CONTRACTS.md CR-3). */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-8 bg-muted px-4 py-16">
      <Logo />
      {children}
    </div>
  );
}
