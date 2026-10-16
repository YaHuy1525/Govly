/**
 * Channel classifier — ported verbatim from hai-track.js v2.0.0 (lines 223–270).
 *
 * Precedence, strongest signal first:
 *   AI assistant → explicit utm_medium → click ID → referrer host → Direct
 *
 * Deviations from the original (all deliberate, documented):
 *  - `isSelf` uses ALL_SELF (SELF + SELF_EXTRA) so the clone can register its
 *    own domains without editing the ported table.
 *  - TypeScript types instead of `var`; behavior identical.
 */

import { AI, ALL_SELF, CLICK_IDS, SEARCH, SOCIAL, WEBMAIL, type Channel } from "./tables.js";

export interface Visit {
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  referrer?: string | null;
  click_id_param?: string | null;
  click_id?: string | null;
}

export interface Classification {
  channel: Channel;
  platform: string | null;
}

function hostOf(url: string | null | undefined): string {
  if (!url) return "";
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

function lookup(list: readonly (readonly [RegExp, string])[], h: string): string | null {
  if (!h) return null;
  for (const [re, name] of list) if (re.test(h)) return name;
  return null;
}

function isSelf(h: string): boolean {
  for (const re of ALL_SELF) if (re.test(h)) return true;
  return false;
}

export function classify(v: Visit): Classification {
  const med = String(v.utm_medium || "").toLowerCase();
  const srcRaw = v.utm_source || "";
  const src = String(srcRaw).toLowerCase();
  const ref = hostOf(v.referrer);
  const click = v.click_id_param
    ? {
        param: v.click_id_param,
        platform: (CLICK_IDS[v.click_id_param] || [])[0],
        channel: (CLICK_IDS[v.click_id_param] || [])[1],
      }
    : null;
  const out = (channel: Channel, platform?: string | null): Classification => ({
    channel,
    platform: platform || (click ? click.platform : null) || null,
  });

  // AI first — before search, so gemini.google.com isn't read as Google organic.
  const ai = lookup(AI, ref) || lookup(AI, hostOf("https://" + src)) || lookup(AI, src);
  if (med === "ai" || med === "ai-assistant" || ai) return out("AI Assistant", ai || srcRaw || null);

  if (med) {
    if (/^(cpc|ppc|paid|paidsearch|paid-search|paid_search|sem|adwords)$/.test(med))
      return out("Paid Search", srcRaw);
    if (/^(paidsocial|paid-social|paid_social)$/.test(med)) return out("Paid Social", srcRaw);
    if (/^(display|banner|cpm|programmatic|native)$/.test(med)) return out("Display", srcRaw);
    if (/^(social|social-media|social_media|organic-social)$/.test(med)) {
      const paid = click && click.channel === "Paid Social";
      return out(paid ? "Paid Social" : "Organic Social", srcRaw || lookup(SOCIAL, ref) || null);
    }
    if (/^(email|e-mail|newsletter|mail)$/.test(med)) return out("Email", srcRaw);
    if (/^(affiliate|partner)$/.test(med)) return out("Affiliate", srcRaw);
    if (/^(referral|referrer)$/.test(med)) return out("Referral", srcRaw || ref || null);
    if (med === "organic") return out("Organic Search", lookup(SEARCH, ref) || srcRaw);
    return out("Campaign", srcRaw || null); // tagged but unrecognised — don't lose it
  }

  if (click && click.channel) return out(click.channel as Channel, click.platform);

  if (ref) {
    if (isSelf(ref)) return out("Internal", null);
    for (const re of WEBMAIL) if (re.test(ref)) return out("Email", "Webmail");
    const s = lookup(SEARCH, ref);
    if (s) return out("Organic Search", s);
    const so = lookup(SOCIAL, ref);
    if (so) return out("Organic Social", so);
    return out("Referral", ref);
  }

  if (srcRaw || v.utm_campaign) return out("Campaign", srcRaw || null);
  return out("Direct", null);
}

/** Does this visit carry a source strong enough to start a new attribution? */
export function hasSignal(v: Visit): boolean {
  return Boolean(v.utm_source || v.utm_medium || v.utm_campaign || v.click_id_param || v.referrer);
}
