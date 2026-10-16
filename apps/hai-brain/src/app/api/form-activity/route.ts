import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { rateLimit } from "../../../lib/ratelimit";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/** Pre-submit form telemetry. Fire-and-forget; tolerant. */
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { success } = await rateLimit(`activity:${ip}`, 60, 60);
  if (!success) return new Response(null, { status: 429 });

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object" || !("sessionId" in body) || !Array.isArray(body.events)) {
    return Response.json({ ok: true, stored: 0 });
  }
  await convex.mutation(api.formActivity.record, body);
  return Response.json({ ok: true, stored: body.events.length });
}
