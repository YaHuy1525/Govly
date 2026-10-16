/**
 * Sliding-window rate limiter (Upstash Redis).
 * The original had NO rate limiting on the three APIs — we add it.
 * Falls back to allow-all when Redis env vars are absent (local dev).
 */

type Window = { count: number; resetAt: number };

const memory = new Map<string, Window>();

export async function rateLimit(
  key: string,
  limit: number,
  windowSec: number,
): Promise<{ success: boolean; remaining: number }> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    // Local dev fallback: in-memory sliding window.
    const now = Date.now();
    const w = memory.get(key);
    if (!w || w.resetAt < now) {
      memory.set(key, { count: 1, resetAt: now + windowSec * 1000 });
      return { success: true, remaining: limit - 1 };
    }
    if (w.count >= limit) return { success: false, remaining: 0 };
    w.count++;
    return { success: true, remaining: limit - w.count };
  }

  const redisKey = `rl:${key}`;
  const res = await fetch(`${url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify([
      ["INCR", redisKey],
      ["EXPIRE", redisKey, windowSec, "NX"],
    ]),
  });
  const data = (await res.json()) as { result: number }[];
  const count = data[0]?.result ?? 1;
  return { success: count <= limit, remaining: Math.max(0, limit - count) };
}
