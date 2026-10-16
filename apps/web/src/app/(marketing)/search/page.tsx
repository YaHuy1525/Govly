import { Container, Section } from "../../../components/primitives";
import { Card } from "../../../components/Card";
import { listCollection, formatDate, type PayloadDoc } from "../../../lib/payload";

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

const LABELS: Record<string, string> = {
  blog: "Blog",
  news: "News",
  glossary: "Glossary",
  papers: "Papers",
  learn: "Learn",
  "media-coverage": "Media Coverage",
  newsletters: "Newsletters",
  "analyst-coverage": "Analyst Coverage",
  "press-release": "Press Releases",
  "case-study": "Case Studies",
  "red-teaming": "Red Teaming",
  "executive-bios": "Executive Bios",
};

/**
 * Which fields are searchable per collection.
 * Payload validates query paths per-collection — querying a field a collection
 * doesn't have 400s the whole request — so each collection lists only its own.
 */
const SEARCH_FIELDS: Record<string, string[]> = {
  blog: ["title", "excerpt"],
  news: ["title", "excerpt", "source"],
  glossary: ["title", "excerpt", "term"],
  papers: ["title", "excerpt", "abstract"],
  learn: ["title", "excerpt"],
  "media-coverage": ["title", "excerpt", "outlet"],
  newsletters: ["title", "excerpt"],
  "analyst-coverage": ["title", "excerpt", "firm", "report"],
  "press-release": ["title", "excerpt"],
  "case-study": ["title", "excerpt", "client"],
  "red-teaming": ["title", "excerpt", "model", "vendor"],
  "executive-bios": ["title", "excerpt", "name"],
};

interface SearchResult extends PayloadDoc {
  _collection: string;
}

/** Full-text search across all collections via Payload's `where[or]` LIKE. */
async function searchAll(query: string): Promise<SearchResult[]> {
  // Pass the raw LIKE pattern; listCollection builds a URLSearchParams which
  // encodes it exactly once. (Pre-encoding the % would double-encode it.)
  const like = `%${query}%`;
  const results: SearchResult[] = [];

  await Promise.all(
    COLLECTIONS.map(async (collection) => {
      // Each where[...] key is its own query param — Payload's qs parser
      // requires that — and only fields this collection actually has.
      const fields = SEARCH_FIELDS[collection] || ["title", "excerpt"];
      const q: Record<string, string> = {};
      fields.forEach((field, i) => {
        q[`where[or][${i}][${field}][like]`] = like;
      });
      const data = await listCollection<PayloadDoc>(collection, { limit: 10, query: q });
      if (data?.docs) {
        for (const doc of data.docs) results.push({ ...doc, _collection: collection });
      }
    }),
  );

  // Sort by published date desc.
  return results.sort((a, b) => {
    const da = new Date(a.publishedAt || a.date || a.createdAt || 0).getTime();
    const db = new Date(b.publishedAt || b.date || b.createdAt || 0).getTime();
    return db - da;
  });
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q || "").trim();
  const results = q.length >= 2 ? await searchAll(q) : [];

  return (
    <Section>
      <Container>
        <h1 className="t-h1" style={{ marginBottom: 24 }}>
          Search
        </h1>
        <form action="/search" method="get" className="search-form">
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search articles, glossary, papers…"
            aria-label="Search query"
          />
          <button type="submit" className="btn btn--primary">
            Search
          </button>
        </form>

        {q.length >= 2 && (
          <p style={{ margin: "24px 0", color: "var(--text)" }}>
            {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{q}&rdquo;
          </p>
        )}

        {results.length > 0 && (
          <div className="card-grid">
            {results.map((doc) => (
              <Card
                key={`${doc._collection}-${doc.id}`}
                href={`/${doc._collection}/${doc.slug}`}
                category={LABELS[doc._collection]}
                title={doc.title || doc.term || doc.name || ""}
                excerpt={doc.excerpt || doc.abstract || ""}
                meta={formatDate(doc.publishedAt || doc.date || doc.createdAt)}
              />
            ))}
          </div>
        )}

        {q.length >= 2 && results.length === 0 && (
          <p style={{ color: "var(--text)" }}>No results found. Try a different search term.</p>
        )}
      </Container>
    </Section>
  );
}
