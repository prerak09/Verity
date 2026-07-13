import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { Space_Grotesk, JetBrains_Mono, Silkscreen } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { siteUrl } from "@/lib/site";
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
  metadataBase: new URL(siteUrl()),
  title: {
    default: "Verity — Career Intelligence Platform",
    template: "%s · Verity",
  },
  description:
    "Verified companies, real internships. Verity is the trust layer for student career discovery.",
  applicationName: "Verity",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Verity",
    title: "Verity — Verified startups, real internships",
    description:
      "Discover manually verified startups and their open internships and jobs. Verity is the trust layer for student career discovery.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Verity — Verified startups, real internships",
    description:
      "Discover manually verified startups and their open internships and jobs.",
  },
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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[3px] focus:border-[3px] focus:border-neutral-950 focus:bg-lime focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:font-bold focus:text-neutral-950"
        >
          Skip to content
        </a>
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
