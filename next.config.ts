import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
    ],
  },
};

export default nextConfig;
