import Link from "next/link";
import { Container, Section } from "../../../components/primitives";
import { Card } from "../../../components/Card";
import { Pagination } from "../../../components/Pagination";
import { listCollection, formatDate, type PayloadDoc } from "../../../lib/payload";

const COLLECTION_META: Record<string, { label: string; lede: string }> = {
  blog: {
    label: "Blog",
    lede: "Practical guidance on AI governance, risk, and compliance.",
  },
  news: {
    label: "News",
    lede: "Company news and announcements from Holistic AI.",
  },
  glossary: {
    label: "Glossary",
    lede: "Definitions for the terms that matter in AI governance.",
  },
  papers: {
    label: "Papers",
    lede: "Research from the Holistic AI team and partners.",
  },
  learn: {
    label: "Learn",
    lede: "Short explainers on AI governance topics.",
  },
  "media-coverage": {
    label: "Media Coverage",
    lede: "Holistic AI in the press.",
  },
  newsletters: {
    label: "Newsletters",
    lede: "The Holistic AI Brief — monthly AI governance digest.",
  },
  "analyst-coverage": {
    label: "Analyst Coverage",
    lede: "How analysts assess Holistic AI.",
  },
  "press-release": {
    label: "Press Releases",
    lede: "Official company announcements.",
  },
  "case-study": {
    label: "Case Studies",
    lede: "How enterprises scale AI governance with Holistic AI.",
  },
  "red-teaming": {
    label: "Red Teaming",
    lede: "Findings from systematic jailbreak and safety testing.",
  },
  "executive-bios": {
    label: "Executive Bios",
    lede: "The team behind Holistic AI.",
  },
};

interface PageProps {
  params: Promise<{ collection: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function CollectionPage({ params, searchParams }: PageProps) {
  const { collection } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const meta = COLLECTION_META[collection];
  if (!meta) {
    return (
      <Container>
        <p style={{ padding: 80 }}>Unknown collection.</p>
      </Container>
    );
  }

  const data = await listCollection<PayloadDoc>(collection, { limit: 12, page });

  return (
    <>
      <Section className="collection-header">
        <Container>
          <h1 className="t-h1">{meta.label}</h1>
          <p>{meta.lede}</p>
        </Container>
      </Section>

      <Container>
        {data && data.docs.length > 0 ? (
          <div className="card-grid">
            {data.docs.map((doc) => (
              <Card
                key={doc.id}
                href={`/${collection}/${doc.slug}`}
                category={doc.categories?.[0]?.name}
                title={doc.title || doc.term || doc.name || ""}
                excerpt={doc.excerpt || doc.abstract || ""}
                meta={formatDate(doc.publishedAt || doc.date || doc.createdAt)}
              />
            ))}
          </div>
        ) : (
          <p style={{ paddingBottom: 96, color: "var(--text)" }}>
            No items yet. Content is managed in the CMS.
          </p>
        )}
        {data && <Pagination base={`/${collection}`} page={data.page} totalPages={data.totalPages} />}
      </Container>
    </>
  );
}
