import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@hai/attribution"],
  experimental: {
    // Convex + Next App Router
  },
};

export default nextConfig;
