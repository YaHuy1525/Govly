import { z } from "zod";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { rateLimit } from "../../../lib/ratelimit";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const leadSchema = z
  .object({
    email: z.string().regex(EMAIL, "A valid email is required."),
    utm_source: z.string().nullish(),
    utm_medium: z.string().nullish(),
    utm_campaign: z.string().nullish(),
    utm_term: z.string().nullish(),
    utm_content: z.string().nullish(),
    referrer: z.string().nullish(),
    landing_page: z.string().nullish(),
    gclid: z.string().nullish(),
    first_utm_source: z.string().nullish(),
    first_utm_medium: z.string().nullish(),
    first_utm_campaign: z.string().nullish(),
    first_referrer: z.string().nullish(),
    first_landing_page: z.string().nullish(),
    first_seen_at: z.string().nullish(),
    pageview_count: z.number().nullish(),
    session_count: z.number().nullish(),
    form_name: z.string().nullish(),
    form_id: z.string().nullish(),
    form_page_url: z.string().nullish(),
    page_title: z.string().nullish(),
  })
  .passthrough(); // click id forwarded under its real param name

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const { success } = await rateLimit(`lead:${ip}`, 10, 60);
  if (!success) return Response.json({ ok: false, error: "Too many requests." }, { status: 429 });

  const body = await req.json().catch(() => ({}));
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, error: "A valid email is required." }, { status: 400 });
  }
  const d = parsed.data;
  // click id under its real param name (passthrough keeps it)
  const clickIdParam = Object.keys(d).find(
    (k) => !k.startsWith("utm_") && !["email", "referrer", "landing_page", "gclid"].includes(k) &&
      !k.startsWith("first_") && !["pageview_count", "session_count", "form_name", "form_id", "form_page_url", "page_title"].includes(k),
  );

  await convex.mutation(api.leads.create, {
    email: d.email,
    utmSource: d.utm_source ?? undefined,
    utmMedium: d.utm_medium ?? undefined,
    utmCampaign: d.utm_campaign ?? undefined,
    utmTerm: d.utm_term ?? undefined,
    utmContent: d.utm_content ?? undefined,
    referrer: d.referrer ?? undefined,
    landingPage: d.landing_page ?? undefined,
    gclid: d.gclid ?? undefined,
    firstUtmSource: d.first_utm_source ?? undefined,
    firstUtmMedium: d.first_utm_medium ?? undefined,
    firstUtmCampaign: d.first_utm_campaign ?? undefined,
    firstReferrer: d.first_referrer ?? undefined,
    firstLandingPage: d.first_landing_page ?? undefined,
    firstSeenAt: d.first_seen_at ?? undefined,
    pageviewCount: d.pageview_count ?? undefined,
    sessionCount: d.session_count ?? undefined,
    formName: d.form_name ?? undefined,
    formId: d.form_id ?? undefined,
    formPageUrl: d.form_page_url ?? undefined,
    pageTitle: d.page_title ?? undefined,
    clickId: clickIdParam ? (d as Record<string, unknown>)[clickIdParam] : undefined,
  });

  // HubSpot sync — never blocks the lead response; failures go to dead-letter log.
  void syncHubSpot(d).catch((err) => console.error("[hubspot-sync]", err));

  return Response.json({ ok: true });
}

async function syncHubSpot(d: z.infer<typeof leadSchema>) {
  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) return;
  const [first, ...rest] = String(d.email).split("@");
  const properties: Record<string, string> = {
    email: d.email,
    first_touch_utm_source: d.first_utm_source || "",
    first_touch_channel: d.first_utm_medium || "",
    last_touch_utm_source: d.utm_source || "",
    last_touch_utm_medium: d.utm_medium || "",
    last_touch_channel: d.utm_medium || "",
    pageview_count: String(d.pageview_count ?? 0),
    session_count: String(d.session_count ?? 0),
    form_name: d.form_name || "",
    landing_page: d.landing_page || "",
  };
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ properties }),
      });
      if (res.ok || res.status === 409) return; // 409 = exists, acceptable
      if (res.status >= 500 && attempt < 2) {
        await new Promise((r) => setTimeout(r, 500 * 2 ** attempt));
        continue;
      }
      console.error("[hubspot-sync] failed", res.status, await res.text());
      return;
    } catch (err) {
      if (attempt < 2) {
        await new Promise((r) => setTimeout(r, 500 * 2 ** attempt));
        continue;
      }
      throw err;
    }
  }
  void first;
  void rest;
}
