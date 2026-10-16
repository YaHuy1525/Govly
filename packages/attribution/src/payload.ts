/**
 * Payload builders — ported from hai-track.js v2.0.0 (lines 401–460).
 *
 * leadFields() returns the flat object merged into the /api/lead POST body.
 * Field names match exactly what the API destructures.
 */

import type { Visit } from "./classify.js";

export interface AttributionState {
  first: Visit | null;
  last: Visit | null;
  counts: { pageviews: number; sessions: number };
}

/**
 * Flat payload to merge into a /api/lead POST.
 * - last touch: the visit that converted
 * - first touch: how they originally found us
 * - engagement: pageviews + sessions before converting
 */
export function leadFields(state: AttributionState): Record<string, string | number | null> {
  const f = state.first || {};
  const l = state.last || {};
  const c = state.counts || { pageviews: 0, sessions: 0 };
  const out: Record<string, string | number | null> = {
    // last touch — the visit that converted
    utm_source: l.utm_source || null,
    utm_medium: l.utm_medium || null,
    utm_campaign: l.utm_campaign || null,
    utm_term: l.utm_term || null,
    utm_content: l.utm_content || null,
    referrer: l.referrer || null,
    landing_page: (l as { landing_page?: string }).landing_page || null,
    gclid: (l as { gclid?: string }).gclid || null,
    // first touch — how they originally found us
    first_utm_source: f.utm_source || null,
    first_utm_medium: f.utm_medium || null,
    first_utm_campaign: f.utm_campaign || null,
    first_referrer: f.referrer || null,
    first_landing_page: (f as { landing_page?: string }).landing_page || null,
    first_seen_at: (f as { ts?: string }).ts || null,
    // engagement before converting
    pageview_count: c.pageviews || 0,
    session_count: c.sessions || 0,
  };
  // Forward whichever click ID we actually saw, under its real param name,
  // so the server can attribute it without this script knowing every platform.
  if (l.click_id_param && l.click_id) out[l.click_id_param] = l.click_id;
  return out;
}

/**
 * The /api/visit pageview beacon body.
 * Shape must match the server's visits.record — raw UTMs and click IDs go in
 * `params` and are re-classified server-side as a safety net.
 */
export interface VisitBeacon {
  type: string;
  visitorId: string;
  sessionId: string;
  isFirstTouch: boolean;
  isNewSession: boolean;
  consent: boolean;
  channel: string | null;
  platform: string | null;
  referrer: string | null;
  landingPage: string;
  pageTitle: string;
  params: Record<string, string | null>;
  ts: string;
}

export function visitBeacon(args: {
  type?: string;
  visitorId: string;
  sessionId: string;
  isFirstTouch: boolean;
  isNewSession: boolean;
  consent: boolean;
  current: Visit & { channel?: string | null; platform?: string | null; landing_page?: string };
  last: Visit;
  pageTitle: string;
  now?: Date;
}): VisitBeacon {
  const { current: cur, last } = args;
  const params: Record<string, string | null> = {
    utm_source: last.utm_source || null,
    utm_medium: last.utm_medium || null,
    utm_campaign: last.utm_campaign || null,
    utm_term: last.utm_term || null,
    utm_content: last.utm_content || null,
  };
  if (last.click_id_param && last.click_id) params[last.click_id_param] = last.click_id;
  return {
    type: args.type || "pageview",
    visitorId: args.visitorId,
    sessionId: args.sessionId,
    isFirstTouch: args.isFirstTouch,
    isNewSession: args.isNewSession,
    consent: args.consent,
    channel: cur.channel || null,
    platform: cur.platform || null,
    referrer: last.referrer || null,
    landingPage: cur.landing_page || "",
    pageTitle: args.pageTitle.slice(0, 200),
    params,
    ts: (args.now || new Date()).toISOString(),
  };
}

/**
 * Form context fields appended to lead/activity payloads.
 * Ported from formContext() (lines 392–399) — naming priority lives in
 * formName() in the tracker (DOM-dependent, stays client-side).
 */
export function formContext(args: {
  formName: string | null;
  formId?: string | null;
  pageUrl: string;
  pageTitle: string;
}): {
  form_name: string | null;
  form_id: string | null;
  form_page_url: string;
  page_title: string;
} {
  return {
    form_name: args.formName,
    form_id: (args.formId as string) || null,
    form_page_url: args.pageUrl,
    page_title: args.pageTitle.slice(0, 200),
  };
}
