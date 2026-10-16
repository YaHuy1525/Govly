import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.holisticai.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Original disallows HubSpot tracking params and pagination params.
        disallow: ["/api/*", "/cms/*", "/_next/*", "/*__hstc=", "/*__hssc=", "/*__hsfp="],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
