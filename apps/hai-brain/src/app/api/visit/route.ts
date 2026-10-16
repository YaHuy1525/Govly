import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { rateLimit } from "../../../lib/ratelimit";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * Pageview beacon target. Fire-and-forget from the client (sendBeacon),
 * so this route is tolerant: malformed bodies still return 200.
 */
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { success } = await rateLimit(`visit:${ip}`, 60, 60);
  if (!success) return new Response(null, { status: 429 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object" || !("visitorId" in body)) {
    return Response.json({ ok: false, error: "malformed" }, { status: 400 });
  }
  await convex.mutation(api.visits.record, body);
  return Response.json({ ok: true });
}
