import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Company logos/banners land here once Cloudinary is wired (FR-16, task 4.4).
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
