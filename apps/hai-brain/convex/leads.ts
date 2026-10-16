import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { reclassify } from "./attribution";

/** Create a lead (POST /api/lead). Email is validated by the route. */
export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    // Re-classify the converting visit server-side.
    const server = reclassify({
      utm_source: args.utmSource ?? null,
      utm_medium: args.utmMedium ?? null,
      utm_campaign: args.utmCampaign ?? null,
      utm_term: args.utmTerm ?? null,
      utm_content: args.utmContent ?? null,
      __referrer: args.referrer ?? null,
    });
    const id = await ctx.db.insert("leads", {
      ...args,
      serverChannel: server.channel,
      hubspotSynced: false,
      createdAt: Date.now(),
    });
    return { id, serverChannel: server.channel };
  },
});

/** Leads awaiting HubSpot sync. */
export const pendingSync = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("leads")
      .filter((q) => q.neq(q.field("hubspotSynced"), true))
      .take(50);
  },
});

/** Mark a lead synced. */
export const markSynced = mutation({
  args: { id: v.id("leads") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { hubspotSynced: true });
  },
});

/** Recent leads (dashboard). */
export const recent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("leads")
      .withIndex("by_createdAt")
      .order("desc")
      .take(args.limit ?? 50);
  },
});

/** Internal: count leads since a timestamp (cron rollups). */
export const countSince = internalMutation({
  args: { since: v.number() },
  handler: async (ctx) => {
    const leads = await ctx.db
      .query("leads")
      .withIndex("by_createdAt", (q) => q.gte("createdAt", 0))
      .take(1000);
    return leads.filter((l) => l.createdAt >= 0).length;
  },
});
