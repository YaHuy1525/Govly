/**
 * Server-side re-classification — the safety net.
 *
 * The client classifies for speed; the server re-classifies from the raw
 * params so a tampered or buggy client cannot corrupt attribution.
 * Ported from convex/attribution.ts (the original's server mirror).
 */

import { classify } from "@hai/attribution";

export function reclassify(params: Record<string, string | null>): {
  channel: string;
  platform: string | null;
} {
  return classify({
    utm_source: params.utm_source ?? null,
    utm_medium: params.utm_medium ?? null,
    utm_campaign: params.utm_campaign ?? null,
    utm_term: params.utm_term ?? null,
    utm_content: params.utm_content ?? null,
    referrer: params.__referrer ?? null,
    click_id_param: params.__click_id_param ?? null,
    click_id: params.__click_id ?? null,
  });
}

/** Pull the click-id param/value out of a raw params object, if present. */
export function extractClickId(
  params: Record<string, string | null>,
): { param: string | null; value: string | null } {
  // The client forwards the click id under its real param name; find the one
  // that isn't a standard utm_* key.
  for (const [k, val] of Object.entries(params)) {
    if (!k.startsWith("utm_") && val) return { param: k, value: val };
  }
  return { param: null, value: null };
}
