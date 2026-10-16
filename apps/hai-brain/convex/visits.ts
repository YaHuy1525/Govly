import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { extractClickId, reclassify } from "./attribution";

/** Record a pageview beacon (POST /api/visit). */
export const record = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const params = (args.params || {}) as Record<string, string | null>;
    const { param: clickParam, value: clickValue } = extractClickId(params);
    // Safety net: re-classify from raw params.
    const server = reclassify({
      ...params,
      __referrer: args.referrer ?? null,
      __click_id_param: clickParam,
      __click_id: clickValue,
    });
    const id = await ctx.db.insert("visits", {
      ...args,
      serverChannel: server.channel,
      createdAt: Date.now(),
    });
    return { id, serverChannel: server.channel };
  },
});

/** All visits for a visitor (debug/support). */
export const byVisitor = query({
  args: { visitorId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("visits")
      .withIndex("by_visitor", (q) => q.eq("visitorId", args.visitorId))
      .order("desc")
      .take(100);
  },
});

/** Recent visits (dashboard). */
export const recent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("visits")
      .withIndex("by_createdAt")
      .order("desc")
      .take(args.limit ?? 50);
  },
});
