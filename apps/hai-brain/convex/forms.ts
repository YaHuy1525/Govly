import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/** Load a form config by slug (for /f/[slug]). */
export const bySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("forms")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

/** Create/update a form (admin-token protected at the route layer). */
export const upsert = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    fields: v.any(),
    theme: v.optional(v.any()),
    minHeight: v.optional(v.number()),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("forms")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, args);
      return { id: existing._id, updated: true };
    }
    const id = await ctx.db.insert("forms", { ...args, createdAt: Date.now() });
    return { id, updated: false };
  },
});
