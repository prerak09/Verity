import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { Space_Grotesk, JetBrains_Mono, Silkscreen } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

// Retro verity.exe theme: Space Grotesk = chunky display headings,
// JetBrains Mono = terminal body, Silkscreen = pixel accents/logo.
const displayFace = Space_Grotesk({
  variable: "--font-display-face",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const monoBody = JetBrains_Mono({
  variable: "--font-mono-body",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

const pixelFace = Silkscreen({
  variable: "--font-pixel-face",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Verity — Career Intelligence Platform",
    template: "%s · Verity",
  },
  description:
    "Verified companies, real internships. Verity is the trust layer for student career discovery.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Demo mode runs the public preview without a real Clerk project, so we skip
  // ClerkProvider entirely (auth is mocked in middleware + lib/auth.ts).
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  const tree = (
    <html
      lang="en"
      className={`${displayFace.variable} ${monoBody.variable} ${pixelFace.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          forcedTheme="light"
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );

  if (demoMode) return tree;

  return (
    <ClerkProvider
      signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}
      signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}
    >
      {tree}
    </ClerkProvider>
  );
}
