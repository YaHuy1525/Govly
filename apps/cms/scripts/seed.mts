/**
 * Seed script — populates one doc per collection + taxonomies.
 * Uses Payload Local API (server-side, bypasses REST access control).
 *
 * Run: npx tsx scripts/seed.mts
 */
import { config } from "dotenv";
config({ path: ".env" });

import { getPayload } from "payload";
import payloadConfig from "../src/payload.config.ts";

const payload = await getPayload({ config: payloadConfig });

const now = new Date().toISOString();

// ── Taxonomies ──────────────────────────────────────────────
const taxonomies = [
  { slug: "blog-categories", name: "AI Governance" },
  { slug: "blog-categories", name: "Red Teaming" },
  { slug: "blog-categories", name: "Compliance" },
  { slug: "type-of-blog", name: "Blog post" },
  { slug: "type-of-blog", name: "News" },
  { slug: "news-categories", name: "Company news" },
  { slug: "paper-categories", name: "Research paper" },
  { slug: "event-categories", name: "Webinar" },
  { slug: "roles", name: "Chief Technology Officer" },
  { slug: "roles", name: "Chief Data Officer" },
  { slug: "industries", name: "Financial Services" },
  { slug: "use-cases", name: "AI Bias Assessment" },
  { slug: "model-categories", name: "OpenAI" },
];

const created: Record<string, string> = {};
for (const t of taxonomies) {
  try {
    const doc = await payload.create({
      collection: t.slug,
      data: { name: t.name, slug: t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
    });
    created[`${t.slug}:${t.name}`] = doc.id;
    console.log(`  ✓ ${t.slug} → ${t.name}`);
  } catch (e) {
    console.log(`  · ${t.slug} "${t.name}" (exists or error: ${String(e).slice(0, 60)})`);
  }
}

// ── Content ─────────────────────────────────────────────────
const body = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "The EU AI Act classifies AI systems into four risk tiers: prohibited, high-risk, limited-risk, and minimal-risk.",
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

const seeds: { collection: string; title: string; data: Record<string, unknown> }[] = [
  {
    collection: "blog",
    title: "Understanding the EU AI Act Risk Framework",
    data: {
      title: "Understanding the EU AI Act Risk Framework",
      excerpt: "A practical guide to classifying AI systems under the EU AI Act.",
      body,
      publishedAt: now,
      featured: true,
      readingTime: 4,
      categories: [created["blog-categories:AI Governance"]].filter(Boolean),
      typeOfBlog: created["type-of-blog:Blog post"],
    },
  },
  {
    collection: "blog",
    title: "Red Teaming LLMs: A Practitioner's Guide",
    data: {
      title: "Red Teaming LLMs: A Practitioner's Guide",
      excerpt: "How systematic red teaming uncovers jailbreaks and prompt-injection risks.",
      body,
      publishedAt: now,
      featured: false,
      categories: [created["blog-categories:Red Teaming"]].filter(Boolean),
    },
  },
  {
    collection: "glossary",
    title: "AI Bias Assessment",
    data: {
      title: "AI Bias Assessment",
      term: "AI Bias Assessment",
      excerpt: "Systematic evaluation of an AI system for unfair outcomes across groups.",
      definition: body,
      body,
      publishedAt: now,
    },
  },
  {
    collection: "glossary",
    title: "Shadow AI",
    data: {
      title: "Shadow AI",
      term: "Shadow AI",
      excerpt: "AI systems deployed without central visibility or governance.",
      definition: body,
      body,
      publishedAt: now,
    },
  },
  {
    collection: "news",
    title: "Holistic AI Named a Challenger in the 2026 Gartner Magic Quadrant",
    data: {
      title: "Holistic AI Named a Challenger in the 2026 Gartner Magic Quadrant",
      excerpt: "Recognition for completeness of vision and ability to execute.",
      body,
      publishedAt: now,
      source: "Company news",
      categories: [created["news-categories:Company news"]].filter(Boolean),
    },
  },
  {
    collection: "events",
    title: "Webinar: Preparing for the EU AI Act Deadline",
    data: {
      title: "Webinar: Preparing for the EU AI Act Deadline",
      excerpt: "A practical session on high-risk system obligations.",
      description: body,
      body,
      date: now,
      publishedAt: now,
      location: "Online",
    },
  },
  {
    collection: "papers",
    title: "Measuring Bias in Large Language Models",
    data: {
      title: "Measuring Bias in Large Language Models",
      abstract: "A methodology for quantifying representational bias in LLM outputs.",
      body,
      publishedAt: now,
      authorsList: "Holistic AI Research",
      categories: [created["paper-categories:Research paper"]].filter(Boolean),
    },
  },
  {
    collection: "learn",
    title: "What is AI Governance?",
    data: {
      title: "What is AI Governance?",
      excerpt: "The practice of managing AI risk, compliance, and accountability.",
      body,
      publishedAt: now,
    },
  },
  {
    collection: "media-coverage",
    title: "Navigating the EU AI Act: Critical Insights for CTOs",
    data: {
      title: "Navigating the EU AI Act: Critical Insights for CTOs",
      excerpt: "Coverage of enterprise AI governance priorities.",
      body,
      publishedAt: now,
      outlet: "Tech Record",
    },
  },
  {
    collection: "newsletters",
    title: "The Holistic AI Brief — October 2026",
    data: {
      title: "The Holistic AI Brief — October 2026",
      excerpt: "Monthly digest of AI governance news and research.",
      body,
      publishedAt: now,
      issue: 12,
      month: "October",
      year: 2026,
    },
  },
  {
    collection: "analyst-coverage",
    title: "Gartner Magic Quadrant for AI Governance Platforms",
    data: {
      title: "Gartner Magic Quadrant for AI Governance Platforms",
      excerpt: "Challenger position in the 2026 assessment.",
      body,
      publishedAt: now,
      firm: "Gartner",
      report: "Magic Quadrant for AI Governance Platforms",
    },
  },
  {
    collection: "press-release",
    title: "Holistic AI Expands Enterprise AI Governance Platform",
    data: {
      title: "Holistic AI Expands Enterprise AI Governance Platform",
      excerpt: "New capabilities for agent discovery and continuous risk monitoring.",
      body,
      publishedAt: now,
      dateline: "LONDON",
    },
  },
  {
    collection: "case-study",
    title: "How Unilever Scaled AI Governance",
    data: {
      title: "How Unilever Scaled AI Governance",
      excerpt: "From spreadsheet tracking to a living AI inventory.",
      challenge: body,
      solution: body,
      body,
      publishedAt: now,
      client: "Unilever",
    },
  },
  {
    collection: "red-teaming",
    title: "ChatGPT Jailbreaking Red Teaming",
    data: {
      title: "ChatGPT Jailbreaking Red Teaming",
      excerpt: "Findings from systematic jailbreak attempts.",
      model: "ChatGPT",
      vendor: "OpenAI",
      findings: body,
      body,
      publishedAt: now,
    },
  },
  {
    collection: "executive-bios",
    title: "Emre Kazim",
    data: {
      title: "Emre Kazim",
      name: "Emre Kazim",
      role: "Co-founder",
      bio: body,
      body,
      publishedAt: now,
    },
  },
  {
    collection: "forms",
    title: "demo-request",
    data: {
      slug: "demo-request",
      title: "Schedule a demo with Holistic AI",
      minHeight: 560,
      active: true,
      fields: [
        { type: "text", name: "name", label: "Full Name", placeholder: "Jane", required: true },
        { type: "email", name: "email", label: "Work email", placeholder: "jane@company.com", required: true },
        {
          type: "select",
          name: "intent",
          label: "What brings you here?",
          required: true,
          options: [{ value: "A solution for my company" }, { value: "A partnership" }],
        },
        {
          type: "textarea",
          name: "message",
          label: "What are you looking for?",
          required: true,
        },
      ],
    },
  },
];

console.log("\nSeeding content...");
for (const s of seeds) {
  try {
    await payload.create({ collection: s.collection, data: s.data as never });
    console.log(`  ✓ ${s.collection} → ${s.title}`);
  } catch (e) {
    console.log(`  · ${s.collection} "${s.title}": ${String(e).slice(0, 80)}`);
  }
}

// ── Summary ─────────────────────────────────────────────────
console.log("\nCollection counts:");
for (const c of ["blog", "glossary", "news", "events", "papers", "learn", "media-coverage", "newsletters", "analyst-coverage", "press-release", "case-study", "red-teaming", "executive-bios", "forms", "blog-categories", "type-of-blog"]) {
  const { totalDocs } = await payload.count({ collection: c });
  console.log(`  ${c}: ${totalDocs}`);
}
console.log("\nDone.");
process.exit(0);
