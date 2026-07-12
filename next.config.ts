import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ],
  },
};

export default nextConfig;
