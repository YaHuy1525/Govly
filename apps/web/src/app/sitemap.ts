import type { MetadataRoute } from "next";
import { listCollection, type PayloadDoc } from "../lib/payload";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.holisticai.com";

const COLLECTIONS = [
  "blog",
  "news",
  "glossary",
  "papers",
  "learn",
  "media-coverage",
  "newsletters",
  "analyst-coverage",
  "press-release",
  "case-study",
  "red-teaming",
  "executive-bios",
];

const STATIC_PATHS = [
  "/",
  "/demo",
  "/thank-you",
  "/thank-you-meeting-scheduled",
  "/thank-you-meeting-not-scheduled",
  "/about",
  "/careers",
  "/trust-center",
  "/integrations",
  "/why-holisticai",
  "/ai-governance-platform",
  "/identify",
  "/protect",
  "/enforce",
  "/privacy-policy",
  "/terms-conditions",
  "/search",
  ...COLLECTIONS,
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified: new Date(),
    changeFrequency: path === "/" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));

  // All CMS docs across all collections.
  await Promise.all(
    COLLECTIONS.map(async (collection) => {
      const data = await listCollection<PayloadDoc>(collection, { limit: 1000 });
      if (!data) return;
      for (const doc of data.docs) {
        entries.push({
          url: `${SITE_URL}/${collection}/${doc.slug}`,
          lastModified: new Date(doc.updatedAt || doc.publishedAt || doc.createdAt || Date.now()),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }),
  );

  return entries;
}
