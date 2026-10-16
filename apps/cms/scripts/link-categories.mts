/**
 * Link content docs to their category taxonomies.
 *
 * The sitemap import created docs and categories but no relations. This assigns
 * each doc a category by keyword-matching its title against category names,
 * falling back to a round-robin so every category has content.
 *
 * Usage: DATABASE_URI=... npx tsx scripts/link-categories.mts
 */
import { config } from "dotenv";
config({ path: ".env" });

import { getPayload } from "payload";
import payloadConfig from "../src/payload.config.ts";

const payload = await getPayload({ config: payloadConfig });

/** content collection → taxonomy collection + the field holding the relation. */
const LINKS: [string, string, string][] = [
  ["blog", "blog-categories", "categories"],
  ["news", "news-categories", "categories"],
  ["papers", "paper-categories", "categories"],
];

function words(s: string): string[] {
  return s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2);
}

for (const [collection, taxonomy, field] of LINKS) {
  // Load all categories.
  const cats: { id: string | number; name: string; slug: string }[] = [];
  let cpage = 1;
  for (;;) {
    const res = await payload.find({ collection: taxonomy, limit: 100, page: cpage, depth: 0 });
    for (const d of res.docs) {
      const c = d as unknown as { id: string | number; name: string; slug: string };
      cats.push({ id: c.id, name: c.name, slug: c.slug });
    }
    if (!res.hasNextPage) break;
    cpage++;
  }
  if (cats.length === 0) {
    console.log(`${taxonomy}: no categories, skipping`);
    continue;
  }

  // Load all docs.
  const docs: { id: string | number; title: string; categories?: unknown }[] = [];
  let dpage = 1;
  for (;;) {
    const res = await payload.find({ collection, limit: 100, page: dpage, depth: 0 });
    for (const d of res.docs) {
      const doc = d as unknown as { id: string | number; title: string; categories?: unknown };
      docs.push({ id: doc.id, title: doc.title, categories: doc.categories });
    }
    if (!res.hasNextPage) break;
    dpage++;
  }

  let linked = 0;
  let skipped = 0;
  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    if (doc.categories && (Array.isArray(doc.categories) ? doc.categories.length : true)) {
      skipped++;
      continue;
    }
    // Keyword match: score each category by shared words with the title.
    const tw = new Set(words(doc.title));
    let best: (typeof cats)[number] | null = null;
    let bestScore = 0;
    for (const cat of cats) {
      const score = words(cat.name).filter((w) => tw.has(w)).length;
      if (score > bestScore) {
        bestScore = score;
        best = cat;
      }
    }
    // Fallback: round-robin so every category gets content.
    const chosen = best ?? cats[i % cats.length];
    try {
      await payload.update({
        collection,
        id: doc.id,
        data: { [field]: [chosen.id] } as never,
      });
      linked++;
    } catch (e) {
      console.log(`  link failed for ${doc.title}: ${String(e).slice(0, 80)}`);
    }
  }
  console.log(`${collection} → ${taxonomy}: linked ${linked}, already-had ${skipped}, of ${docs.length}`);
}

console.log("Done.");
process.exit(0);
