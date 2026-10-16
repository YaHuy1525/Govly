import Link from "next/link";
import { Container } from "./primitives";
import { ArticleBody } from "./ArticleBody";
import { formatDate, readingTime, type PayloadDoc } from "../lib/payload";

/** Shared article template for all content collections. */
export function ArticleTemplate({
  doc,
  collection,
  backLabel,
}: {
  doc: PayloadDoc;
  collection: string;
  backLabel: string;
}) {
  const title = doc.title || doc.term || doc.name || "Untitled";
  const rt = doc.readingTime || readingTime(doc.body);
  const published = formatDate(doc.publishedAt || doc.date || doc.createdAt);

  return (
    <article className="article">
      <Container>
        <nav className="article__breadcrumb" aria-label="Breadcrumb">
          <Link href={`/${collection}`}>{backLabel}</Link>
          <span aria-hidden="true">/</span>
          <span>{title}</span>
        </nav>

        <header className="article__header">
          <h1 className="t-h1 article__title">{title}</h1>
          <div className="article__meta">
            {published && <time>{published}</time>}
            <span>·</span>
            <span>{rt} min read</span>
            {doc.categories?.[0] && (
              <>
                <span>·</span>
                <Link href={`/${collection}`}>{doc.categories[0].name}</Link>
              </>
            )}
          </div>
          {doc.excerpt && <p className="article__excerpt">{doc.excerpt}</p>}
        </header>

        <div className="article__layout">
          <div className="article__content">
            <ArticleBody body={doc.body} />
          </div>

          <aside className="article__toc">
            <TableOfContents body={doc.body} />
          </aside>
        </div>
      </Container>
    </article>
  );
}

interface TocNode {
  type: string;
  tag?: string;
  children?: TocNode[];
}

/** Extract h2/h3 headings for the TOC sidebar. */
function TableOfContents({ body }: { body: unknown }) {
  if (!body || typeof body !== "object") return null;
  const root = (body as { root?: TocNode }).root ?? (body as TocNode);
  const headings: { tag: string; text: string; id: string }[] = [];

  function walk(nodes?: TocNode[]) {
    if (!nodes) return;
    for (const n of nodes) {
      if (n.type === "heading" && (n.tag === "h2" || n.tag === "h3")) {
        const text = (n.children || []).map((c) => (c as { text?: string }).text || "").join("");
        if (text) headings.push({ tag: n.tag, text, id: slugify(text) });
      }
      if (n.children) walk(n.children);
    }
  }
  walk(root.children);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="On this page" className="toc">
      <p className="toc__title">On this page</p>
      <ul>
        {headings.map((h) => (
          <li key={h.id} className={h.tag === "h3" ? "toc__sub" : undefined}>
            <a href={`#${h.id}`}>{h.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
