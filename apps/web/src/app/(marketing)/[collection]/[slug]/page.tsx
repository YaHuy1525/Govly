import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { ArticleTemplate } from "../../../../components/ArticleTemplate";
import type { PayloadDoc } from "../../../../lib/payload";

const META: Record<string, { label: string; titleField: string }> = {
  blog: { label: "Blog", titleField: "title" },
  news: { label: "News", titleField: "title" },
  glossary: { label: "Glossary", titleField: "term" },
  papers: { label: "Papers", titleField: "title" },
  learn: { label: "Learn", titleField: "title" },
  "media-coverage": { label: "Media Coverage", titleField: "title" },
  newsletters: { label: "Newsletters", titleField: "title" },
  "analyst-coverage": { label: "Analyst Coverage", titleField: "title" },
  "press-release": { label: "Press Releases", titleField: "title" },
  "case-study": { label: "Case Studies", titleField: "title" },
  "red-teaming": { label: "Red Teaming", titleField: "title" },
  "executive-bios": { label: "Executive Bios", titleField: "name" },
};

interface PageProps {
  params: Promise<{ collection: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { collection, slug } = await params;
  const doc = await fetchDoc<PayloadDoc>(collection, slug, false);
  if (!doc) return { title: "Not found" };
  const title = doc.seoTitle || doc.title || doc.term || doc.name || "Untitled";
  return {
    title,
    description: doc.seoDescription || doc.excerpt || doc.abstract || undefined,
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { collection, slug } = await params;
  const { isEnabled } = await draftMode();
  // Draft mode (via /api/preview) requests the unpublished version from the CMS.
  const doc = await fetchDoc<PayloadDoc>(collection, slug, isEnabled);
  if (!doc) notFound();
  const meta = META[collection] || { label: "Article", titleField: "title" };
  return <ArticleTemplate doc={doc} collection={collection} backLabel={meta.label} />;
}

/** Fetch a doc; when draft=true, request the unpublished version (no cache). */
async function fetchDoc<T>(collection: string, slug: string, draft: boolean): Promise<T | null> {
  const q = new URLSearchParams({
    "where[slug][equals]": slug,
    limit: "1",
  });
  if (draft) q.set("draft", "true");
  const CMS_URL = process.env.CMS_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${CMS_URL}/api/${collection}?${q}`, {
      cache: draft ? "no-store" : undefined,
      next: draft ? undefined : { revalidate: 60 },
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { docs?: T[] };
    return data.docs?.[0] ?? null;
  } catch {
    return null;
  }
}
