import { EmbedBootstrap } from "../../../components/EmbedBootstrap";
import { FormClient } from "../../../components/FormClient";

/**
 * /f/[slug] — the embeddable form route.
 *
 * Server component loads the form config from Convex (falls back to the
 * hardcoded demo-request config for resilience when Convex is unreachable).
 */

const FALLBACK_FORMS: Record<string, { title: string; minHeight: number }> = {
  "demo-request": { title: "Schedule a demo with Holistic AI", minHeight: 560 },
};

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function FormPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const isEmbed = sp.embed === "1";

  // Try Convex first; fall back to the built-in config.
  let title = FALLBACK_FORMS[slug]?.title || FALLBACK_FORMS["demo-request"].title;
  let minHeight = FALLBACK_FORMS[slug]?.minHeight || 560;

  if (process.env.NEXT_PUBLIC_CONVEX_URL) {
    try {
      const { ConvexHttpClient } = await import("convex/browser");
      const { api } = await import("../../../../convex/_generated/api");
      const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);
      const form = await convex.query(api.forms.bySlug, { slug });
      if (form) {
        title = form.title;
        minHeight = form.minHeight || 560;
      }
    } catch {
      // Convex unreachable — fall back silently.
    }
  }

  return (
    <>
      <EmbedBootstrap slug={slug} />
      <main className="public-form-card" style={isEmbed ? { minHeight } : undefined}>
        <FormClient slug={slug} title={title} />
      </main>
    </>
  );
}
