import { notFound } from "next/navigation";

const CMS_URL = process.env.CMS_URL || "http://localhost:3000";

async function cmsFetch<T>(path: string, revalidate = 60): Promise<T | null> {
  try {
    const res = await fetch(`${CMS_URL}/api/${path}`, {
      next: { revalidate },
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export interface PayloadDoc {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  body?: unknown;
  publishedAt?: string | null;
  featured?: boolean;
  updatedAt?: string;
  createdAt?: string;
  cover?: unknown;
  categories?: { id: string; name: string; slug: string }[];
  authors?: unknown[];
  readingTime?: number | null;
  // collection-specific extras
  term?: string;
  outlet?: string;
  source?: string;
  firm?: string;
  report?: string;
  client?: string;
  model?: string;
  vendor?: string;
  name?: string;
  role?: string;
  issue?: number;
  month?: string;
  year?: number;
  date?: string | null;
  abstract?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface PayloadList<T> {
  docs: T[];
  totalDocs: number;
  totalPages: number;
  page: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Query a Payload collection.
 *
 * `query` holds raw Payload query keys — e.g.
 *   { "where[slug][equals]": "my-slug" }
 *   { "where[or][0][title][like]": "%governance%" }
 * Each entry becomes its own query param (URLSearchParams encodes the brackets
 * exactly once). Passing a pre-joined "where[a]=x&where[b]=y" string does NOT
 * work — Payload's qs parser needs the keys separated.
 */
export function listCollection<T = PayloadDoc>(
  collection: string,
  params: {
    limit?: number;
    page?: number;
    sort?: string;
    query?: Record<string, string>;
  } = {},
): Promise<PayloadList<T> | null> {
  const q = new URLSearchParams();
  if (params.limit) q.set("limit", String(params.limit));
  if (params.page) q.set("page", String(params.page));
  q.set("sort", params.sort || "-publishedAt");
  if (params.query) {
    for (const [key, value] of Object.entries(params.query)) q.set(key, value);
  }
  const qs = q.toString();
  return cmsFetch<PayloadList<T>>(`${collection}${qs ? `?${qs}` : ""}`);
}

export function getDoc<T = PayloadDoc>(collection: string, slug: string): Promise<T | null> {
  return listCollection<T>(collection, {
    limit: 1,
    query: { "where[slug][equals]": slug },
  }).then((r) => r?.docs?.[0] ?? null);
}

/** Estimate reading time (200 wpm) when the CMS didn't compute it. */
export function readingTime(body: unknown): number {
  try {
    const text = JSON.stringify(body ?? "");
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
  } catch {
    return 1;
  }
}

export function formatDate(iso?: string | null): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

/** Fetch a doc by slug or 404 — the standard collection-page entry. */
export async function requireDoc<T = PayloadDoc>(
  collection: string,
  slug: string,
): Promise<T> {
  const doc = await getDoc<T>(collection, slug);
  if (!doc) notFound();
  return doc;
}
