import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/** Allowlisted menu fields whose VALUES may be retained (selections, not prose). */
export const ACTIVITY_VALUES: Record<string, true> = {
  intent: true,
  plan: true,
  team_size: true,
  topic: true,
};

/** Record pre-submit form telemetry (POST /api/form-activity). */
export const record = mutation({
  args: {
    sessionId: v.string(),
    email: v.optional(v.string()),
    pagePath: v.string(),
    formName: v.optional(v.string()),
    events: v.array(
      v.object({
        type: v.string(),
        field: v.string(),
        filled: v.boolean(),
        length: v.number(),
        value: v.optional(v.string()),
        at: v.number(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    // Safety net: strip values outside the allowlist again, server-side.
    // Widening the client allowlist alone must not start capturing free text.
    const events = args.events.map((e) => {
      if (e.value !== undefined && !ACTIVITY_VALUES[e.field]) {
        const { value: _drop, ...rest } = e;
        return rest;
      }
      return e;
    });
    const id = await ctx.db.insert("formActivity", {
      sessionId: args.sessionId,
      email: args.email,
      pagePath: args.pagePath,
      formName: args.formName,
      events,
      createdAt: Date.now(),
    });
    return { id, stored: events.length };
  },
});

/** Activity for a session (debug). */
export const bySession = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("formActivity")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .take(20);
  },
});
