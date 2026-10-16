import { query } from "./_generated/server";
import { v } from "convex/values";

/** Per-channel conversion: visits → leads, % (dashboard). */
export const channelConversion = query({
  args: { sinceDays: v.optional(v.number()) },
  handler: async (ctx) => {
    const visits = await ctx.db.query("visits").take(10000);
    const leads = await ctx.db.query("leads").take(10000);
    const byChannel: Record<string, { visits: number; leads: number }> = {};
    for (const v of visits) {
      const ch = v.serverChannel || v.channel || "Direct";
      byChannel[ch] = byChannel[ch] || { visits: 0, leads: 0 };
      byChannel[ch].visits++;
    }
    for (const l of leads) {
      const ch = l.serverChannel || "Direct";
      byChannel[ch] = byChannel[ch] || { visits: 0, leads: 0 };
      byChannel[ch].leads++;
    }
    return Object.entries(byChannel)
      .map(([channel, s]) => ({
        channel,
        visits: s.visits,
        leads: s.leads,
        conversion: s.visits ? +(s.leads / s.visits * 100).toFixed(2) : 0,
      }))
      .sort((a, b) => b.visits - a.visits);
  },
});

/** AI-referral volume over time, by platform. */
export const aiReferrals = query({
  args: {},
  handler: async (ctx) => {
    const visits = await ctx.db.query("visits").take(10000);
    const ai = visits.filter((v) => (v.serverChannel || v.channel) === "AI Assistant");
    const byPlatform: Record<string, number> = {};
    for (const v of ai) {
      const p = v.platform || "unknown";
      byPlatform[p] = (byPlatform[p] || 0) + 1;
    }
    return { total: ai.length, byPlatform };
  },
});

/** Form abandonment funnel from formActivity events. */
export const abandonmentFunnel = query({
  args: {},
  handler: async (ctx) => {
    const acts = await ctx.db.query("formActivity").take(5000);
    const sessions = new Set<string>();
    const touched: Record<string, Set<string>> = {};
    const emails = new Set<string>();
    for (const a of acts) {
      sessions.add(a.sessionId);
      if (a.email) emails.add(a.email);
      touched[a.sessionId] = touched[a.sessionId] || new Set();
      for (const e of a.events) touched[a.sessionId].add(e.field);
    }
    return {
      sessionsWithActivity: sessions.size,
      emailsCaptured: emails.size,
      avgFieldsTouched:
        sessions.size
          ? +(Object.values(touched).reduce((s, set) => s + set.size, 0) / sessions.size).toFixed(1)
          : 0,
    };
  },
});

/** First-vs-last-touch attribution shift. */
export const firstVsLast = query({
  args: {},
  handler: async (ctx) => {
    const leads = await ctx.db.query("leads").take(5000);
    const shifted = leads.filter((l) => {
      const first = l.firstUtmSource || l.firstReferrer;
      const last = l.utmSource || l.referrer;
      return first && last && first !== last;
    });
    return { totalLeads: leads.length, shifted: shifted.length };
  },
});
