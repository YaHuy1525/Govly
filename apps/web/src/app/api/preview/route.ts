import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

/**
 * Preview mode — enables Payload draft rendering.
 * Usage: /api/preview?secret=<PREVIEW_SECRET>&slug=<slug>&collection=<collection>
 *
 * Sets the draft-mode cookie, then redirects to the content page. The page
 * reads draftMode() and passes `?draft=true` to the CMS fetch, which returns
 * unpublished docs.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get("secret");
  const slug = searchParams.get("slug");
  const collection = searchParams.get("collection");

  if (secret !== process.env.PREVIEW_SECRET || !slug || !collection) {
    return new Response("Invalid preview request", { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();

  redirect(`/${collection}/${slug}?preview=1`);
}
