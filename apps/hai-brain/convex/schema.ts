import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Convex schema — mirrors the hai-track.js payload contracts exactly.
 *
 * - visits:       every /api/visit beacon (pageviews + custom events)
 * - leads:        every /api/lead submission (first + last touch joined)
 * - formActivity: pre-submit field-level telemetry from /api/form-activity
 * - forms:        embeddable form configs (slug, fields, theme)
 * - dailyStats:   hourly cron rollups for dashboard speed
 */

export const visitValidator = v.object({
  visitorId: v.string(),
  sessionId: v.string(),
  type: v.string(),
  isFirstTouch: v.boolean(),
  isNewSession: v.boolean(),
  consent: v.boolean(),
  channel: v.optional(v.string()),
  platform: v.optional(v.string()),
  referrer: v.optional(v.string()),
  landingPage: v.optional(v.string()),
  pageTitle: v.optional(v.string()),
  params: v.any(),
  ts: v.string(),
});

export const leadValidator = v.object({
  email: v.string(),
  // last touch (converting visit)
  utmSource: v.optional(v.string()),
  utmMedium: v.optional(v.string()),
  utmCampaign: v.optional(v.string()),
  utmTerm: v.optional(v.string()),
  utmContent: v.optional(v.string()),
  referrer: v.optional(v.string()),
  landingPage: v.optional(v.string()),
  gclid: v.optional(v.string()),
  // first touch (original discovery)
  firstUtmSource: v.optional(v.string()),
  firstUtmMedium: v.optional(v.string()),
  firstUtmCampaign: v.optional(v.string()),
  firstReferrer: v.optional(v.string()),
  firstLandingPage: v.optional(v.string()),
  firstSeenAt: v.optional(v.string()),
  // engagement before converting
  pageviewCount: v.optional(v.number()),
  sessionCount: v.optional(v.number()),
  // form identity
  formName: v.optional(v.string()),
  formId: v.optional(v.string()),
  formPageUrl: v.optional(v.string()),
  pageTitle: v.optional(v.string()),
  // click id forwarded under its real param name
  clickId: v.optional(v.any()),
});

export const formActivityEventValidator = v.object({
  type: v.string(), // focus | input | blur
  field: v.string(),
  filled: v.boolean(),
  length: v.number(),
  value: v.optional(v.string()), // ONLY allowlisted menu fields
  at: v.number(),
});

export default defineSchema({
  visits: defineTable({
    visitorId: v.string(),
    sessionId: v.string(),
    type: v.string(),
    isFirstTouch: v.boolean(),
    isNewSession: v.boolean(),
    consent: v.boolean(),
    channel: v.optional(v.string()),
    platform: v.optional(v.string()),
    referrer: v.optional(v.string()),
    landingPage: v.optional(v.string()),
    pageTitle: v.optional(v.string()),
    params: v.any(),
    ts: v.string(),
    // server-added:
    serverChannel: v.optional(v.string()), // re-classification (safety net)
    createdAt: v.number(),
  })
    .index("by_visitor", ["visitorId"])
    .index("by_ts", ["ts"])
    .index("by_channel", ["channel"])
    .index("by_createdAt", ["createdAt"]),

  leads: defineTable({
    email: v.string(),
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
    utmTerm: v.optional(v.string()),
    utmContent: v.optional(v.string()),
    referrer: v.optional(v.string()),
    landingPage: v.optional(v.string()),
    gclid: v.optional(v.string()),
    firstUtmSource: v.optional(v.string()),
    firstUtmMedium: v.optional(v.string()),
    firstUtmCampaign: v.optional(v.string()),
    firstReferrer: v.optional(v.string()),
    firstLandingPage: v.optional(v.string()),
    firstSeenAt: v.optional(v.string()),
    pageviewCount: v.optional(v.number()),
    sessionCount: v.optional(v.number()),
    formName: v.optional(v.string()),
    formId: v.optional(v.string()),
    formPageUrl: v.optional(v.string()),
    pageTitle: v.optional(v.string()),
    clickId: v.optional(v.any()),
    // server-added:
    serverChannel: v.optional(v.string()),
    hubspotSynced: v.optional(v.boolean()),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_createdAt", ["createdAt"])
    .index("by_formName", ["formName"]),

  formActivity: defineTable({
    sessionId: v.string(),
    email: v.optional(v.string()),
    pagePath: v.string(),
    formName: v.optional(v.string()),
    events: v.array(formActivityEventValidator),
    createdAt: v.number(),
  })
    .index("by_session", ["sessionId"])
    .index("by_createdAt", ["createdAt"]),

  forms: defineTable({
    slug: v.string(),
    title: v.string(),
    fields: v.any(),
    theme: v.optional(v.any()),
    minHeight: v.optional(v.number()),
    active: v.boolean(),
    createdAt: v.number(),
  }).index("by_slug", ["slug"]),

  dailyStats: defineTable({
    date: v.string(), // YYYY-MM-DD
    channel: v.string(),
    visits: v.number(),
    leads: v.number(),
    createdAt: v.number(),
  })
    .index("by_date", ["date"])
    .index("by_channel", ["channel"]),
});
