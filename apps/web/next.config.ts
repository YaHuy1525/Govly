import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@hai/attribution", "@hai/ui"],
  async rewrites() {
    // Proxy the Payload CMS REST API during development.
    return [
      {
        source: "/cms/:path*",
        destination: `${process.env.CMS_URL || "http://localhost:3000"}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
