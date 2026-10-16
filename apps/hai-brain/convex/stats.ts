import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

/** Hourly rollup: aggregate visits/leads per channel per day into dailyStats. */
export const rollup = internalMutation({
  args: {},
  handler: async (ctx) => {
    const since = Date.now() - 24 * 60 * 60 * 1000;
    const visits = await ctx.db.query("visits").take(10000);
    const leads = await ctx.db.query("leads").take(10000);
    const day = new Date().toISOString().slice(0, 10);
    const agg: Record<string, { visits: number; leads: number }> = {};

    for (const v of visits) {
      if (v.createdAt < since) continue;
      const ch = v.serverChannel || v.channel || "Direct";
      agg[ch] = agg[ch] || { visits: 0, leads: 0 };
      agg[ch].visits++;
    }
    for (const l of leads) {
      if (l.createdAt < since) continue;
      const ch = l.serverChannel || "Direct";
      agg[ch] = agg[ch] || { visits: 0, leads: 0 };
      agg[ch].leads++;
    }
    for (const [channel, s] of Object.entries(agg)) {
      await ctx.db.insert("dailyStats", {
        date: day,
        channel,
        visits: s.visits,
        leads: s.leads,
        createdAt: Date.now(),
      });
    }
    return { day, channels: Object.keys(agg).length };
  },
});
