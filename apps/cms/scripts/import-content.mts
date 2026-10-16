/**
 * Full content import — generates the complete 758-URL content structure
 * from the original site's sitemap (artifacts/sitemap.xml).
 *
 * For each collection, creates a doc per real slug from the sitemap, with
 * generated title/excerpt/body. This gives the site its full route structure
 * so sitemap.xml, category pages, and navigation all have real content.
 *
 * Usage: DATABASE_URI=... npx tsx scripts/import-content.mts
 */
import { config } from "dotenv";
config({ path: ".env" });

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getPayload } from "payload";
import payloadConfig from "../src/payload.config.ts";

const payload = await getPayload({ config: payloadConfig });

// ── Parse the original sitemap ────────────────────────────────
const sitemapPath = resolve(import.meta.dirname, "../../../artifacts/sitemap.xml");
const xml = readFileSync(sitemapPath, "utf8");
const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
console.log(`Sitemap: ${locs.length} URLs`);

// Strip the origin so regexes can match pathnames (/blog/<slug>).
const BASE = "https://www.holisticai.com";
const paths = locs
  .map((u) => (u.startsWith(BASE) ? u.slice(BASE.length) : u.replace(/^https?:\/\/[^/]+/, "")))
  .filter((p) => p.startsWith("/"));

// Map URL path prefix → collection slug.
const PREFIX_MAP: [RegExp, string][] = [
  [/^\/blog\/([^/]+)$/, "blog"],
  [/^\/news\/([^/]+)$/, "news"],
  [/^\/glossary\/([^/]+)$/, "glossary"],
  [/^\/papers\/([^/]+)$/, "papers"],
  [/^\/learn\/([^/]+)$/, "learn"],
  [/^\/media-coverage\/([^/]+)$/, "media-coverage"],
  [/^\/newsletters\/([^/]+)$/, "newsletters"],
  [/^\/analyst-coverage\/([^/]+)$/, "analyst-coverage"],
  [/^\/press-release\/([^/]+)$/, "press-release"],
  [/^\/case-study\/([^/]+)$/, "case-study"],
  [/^\/red-teaming\/([^/]+)$/, "red-teaming"],
  [/^\/executive-bios\/([^/]+)$/, "executive-bios"],
];

// Category prefixes (taxonomies).
const CATEGORY_PREFIX_MAP: [RegExp, string][] = [
  [/^\/blog-category\/([^/]+)$/, "blog-categories"],
  [/^\/news-category\/([^/]+)$/, "news-categories"],
  [/^\/event-category\/([^/]+)$/, "event-categories"],
  [/^\/paper-category\/([^/]+)$/, "paper-categories"],
  [/^\/type-of-blog\/([^/]+)$/, "type-of-blog"],
];

function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function bodyFor(title: string) {
  return {
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: `${title}. This content was imported from the original site structure. Replace with the full article body.`,
              type: "text",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "paragraph",
          version: 1,
        },
      ],
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  };
}

const now = new Date().toISOString();
const counts: Record<string, number> = {};

/** Fetch all existing slugs for a collection in one query (avoids OOM). */
async function existingSlugs(collection: string): Promise<Set<string>> {
  const slugs = new Set<string>();
  let page = 1;
  // Page through all docs (limit 100 per page) collecting slugs.
  for (;;) {
    const res = await payload.find({ collection, limit: 100, page, depth: 0 });
    for (const doc of res.docs) {
      const s = (doc as { slug?: string }).slug;
      if (s) slugs.add(s);
    }
    if (!res.hasNextPage) break;
    page++;
  }
  return slugs;
}

// ── Import taxonomies first (so relations can attach) ──────────
for (const [re, collection] of CATEGORY_PREFIX_MAP) {
  const wanted: string[] = [];
  for (const loc of paths) {
    const m = loc.match(re);
    if (m) wanted.push(m[1]);
  }
  if (wanted.length === 0) continue;
  const have = await existingSlugs(collection);
  let created = 0;
  for (const slug of wanted) {
    if (have.has(slug)) continue;
    try {
      await payload.create({ collection, data: { name: titleFromSlug(slug), slug } });
      created++;
    } catch {
      /* skip */
    }
  }
  counts[collection] = created;
  console.log(`  ${collection}: +${created} (of ${wanted.length})`);
}
console.log("Taxonomies:", JSON.stringify(counts));

// ── Import content docs ───────────────────────────────────────
const contentCounts: Record<string, number> = {};
for (const [re, collection] of PREFIX_MAP) {
  const wanted: string[] = [];
  for (const loc of paths) {
    const m = loc.match(re);
    if (m) wanted.push(m[1]);
  }
  if (wanted.length === 0) continue;
  const have = await existingSlugs(collection);
  let created = 0;
  let loggedError = false;
  for (const slug of wanted) {
    if (have.has(slug)) continue;
    const title = titleFromSlug(slug);
    try {
      await payload.create({
        collection,
        data: {
          title,
          slug,
          excerpt: `${title} — imported from the original Holistic AI site structure.`,
          body: bodyFor(title),
          publishedAt: now,
          featured: false,
          ...(collection === "glossary" ? { term: title, definition: bodyFor(title) } : {}),
          ...(collection === "papers" ? { abstract: `${title} — abstract.`, authorsList: "Holistic AI" } : {}),
          ...(collection === "events" ? { description: bodyFor(title), date: now } : {}),
          ...(collection === "case-study" ? { client: titleFromSlug(slug), challenge: bodyFor(title), solution: bodyFor(title) } : {}),
          ...(collection === "red-teaming" ? { model: titleFromSlug(slug), findings: bodyFor(title) } : {}),
          ...(collection === "executive-bios" ? { name: title, role: "Team member", bio: bodyFor(title) } : {}),
          ...(collection === "media-coverage" ? { outlet: "Press" } : {}),
          ...(collection === "analyst-coverage" ? { firm: "Analyst", report: title } : {}),
          ...(collection === "newsletters" ? { issue: 1, month: "January", year: 2026 } : {}),
          ...(collection === "press-release" ? { dateline: "LONDON" } : {}),
        } as never,
      });
      created++;
    } catch (e) {
      if (!loggedError) {
        console.log(`  ${collection} first error: ${String(e).slice(0, 100)}`);
        loggedError = true;
      }
    }
  }
  contentCounts[collection] = created;
  console.log(`  ${collection}: +${created} (of ${wanted.length})`);
}

// ── Summary ───────────────────────────────────────────────────
console.log("\nImported:", JSON.stringify(contentCounts));
const total = Object.values(contentCounts).reduce((a, b) => a + b, 0);
console.log(`Total new docs: ${total}`);

for (const c of [...new Set([...PREFIX_MAP.map((p) => p[1])])]) {
  const { totalDocs } = await payload.count({ collection: c });
  console.log(`  ${c}: ${totalDocs} total`);
}
console.log("Done.");
process.exit(0);
