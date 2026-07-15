import type { NextConfig } from "next";

// Baseline security headers (audit ISSUE-013). A strict Content-Security-Policy
// is intentionally omitted here: Clerk + Vercel inject inline/eval scripts and a
// wrong CSP silently breaks auth, so it needs its own tested rollout. These four
// are safe to apply globally today.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework/version (audit ISSUE-035).
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  images: {
    // Many imported company logos are official brand SVGs (Wikimedia, company
    // sites). Next blocks SVGs through the optimizer by default since a raw SVG
    // can embed scripts; the CSP + attachment disposition below are Next's
    // documented mitigation for safely allowing them.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Company logos/banners land here once Cloudinary is wired (FR-16, task 4.4).
    // The other hosts below serve official logos for companies imported directly
    // from job listings (see prisma/seed/companies.ts) rather than uploaded via
    // Cloudinary.
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "bookface-images.s3.us-west-2.amazonaws.com" },
      { protocol: "https", hostname: "bookface-images.s3.amazonaws.com" },
      { protocol: "https", hostname: "www.meshy.ai" },
      { protocol: "https", hostname: "superkalam.com" },
      { protocol: "https", hostname: "fin.ai" },
      { protocol: "https", hostname: "tower-research.com" },
      { protocol: "https", hostname: "walleyecapital.com" },
      { protocol: "https", hostname: "cdn.prod.website-files.com" },
      { protocol: "https", hostname: "solopulse.com" },
      { protocol: "https", hostname: "www.meesho.io" },
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "www.ory.com" },
      { protocol: "https", hostname: "www.finn.com" },
      { protocol: "https", hostname: "www.tines.com" },
      { protocol: "https", hostname: "wayflyer.com" },
      { protocol: "https", hostname: "truelayer.com" },
      { protocol: "https", hostname: "static.lenskart.com" },
      { protocol: "https", hostname: "razorpay.com" },
      { protocol: "https", hostname: "careers.swiggy.com" },
      { protocol: "https", hostname: "www.hudsonrivertrading.com" },
    ],
  },
};

export default nextConfig;
