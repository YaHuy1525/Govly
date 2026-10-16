import { describe, expect, it, beforeEach } from "vitest";
import { loadTracker, setLocation, setReferrer, stubBeacon, stubFetch, resetStore } from "./setup";

declare global {
  interface Window {
    HAITrack: {
      get: () => { first: { channel: string } | null; last: { channel: string } | null; counts: { pageviews: number; sessions: number } };
      channel: () => string;
      fields: (form?: unknown) => Record<string, unknown>;
      version: string;
      grantConsent: () => void;
      revokeConsent: () => void;
    };
  }
}

beforeEach(() => {
  resetStore();
  setLocation("https://www.example.com/");
  setReferrer("");
  // Neutralize happy-dom's real fetch for EVERY test so async beacon/fetch
  // rejections from a prior test never leak into the next one's assertions.
  stubFetch();
});

describe("tracker — identity + storage", () => {
  it("creates a 32-hex visitor ID in localStorage", () => {
    loadTracker();
    const id = JSON.parse(localStorage.getItem("hai_visitor") || "null");
    expect(id).toMatch(/^[0-9a-f]{32}$/);
  });

  it("reuses the same visitor ID across reloads", () => {
    loadTracker();
    const first = localStorage.getItem("hai_visitor");
    loadTracker();
    expect(localStorage.getItem("hai_visitor")).toBe(first);
  });

  it("exposes version 2.0.0", () => {
    loadTracker();
    expect(window.HAITrack.version).toBe("2.0.0");
  });
});

describe("tracker — classification + attribution state", () => {
  it("classifies a paid click and records first + last touch", () => {
    setLocation("https://www.example.com/?utm_source=google&utm_medium=cpc&gclid=abc123");
    loadTracker();
    const state = window.HAITrack.get();
    expect(state.first?.channel).toBe("Paid Search");
    expect(state.last?.channel).toBe("Paid Search");
  });

  it("classifies an AI referrer as AI Assistant (not Google organic)", () => {
    setLocation("https://www.example.com/blog/post");
    setReferrer("https://gemini.google.com/");
    loadTracker();
    expect(window.HAITrack.get().first?.channel).toBe("AI Assistant");
  });

  it('internal navigation does not overwrite last touch', () => {
    setLocation('https://www.holisticai.com/?utm_source=linkedin&utm_medium=social');
    loadTracker();
    expect(window.HAITrack.get().last?.channel).toBe('Organic Social');
    // Second load: self-referral, no signal — last touch must NOT change.
    setLocation('https://www.holisticai.com/pricing');
    setReferrer('https://www.holisticai.com/blog');
    loadTracker();
    expect(window.HAITrack.get().last?.channel).toBe('Organic Social');
  });

  it("counts pageviews and sessions", () => {
    setLocation("https://www.example.com/?utm_source=news&utm_campaign=oct");
    loadTracker();
    const state = window.HAITrack.get();
    expect(state.counts.pageviews).toBeGreaterThanOrEqual(1);
    expect(state.counts.sessions).toBeGreaterThanOrEqual(1);
  });

  it("fields() returns first + last + engagement for /api/lead", () => {
    setLocation("https://www.example.com/?utm_source=google&utm_medium=cpc&gclid=abc123");
    loadTracker();
    const f = window.HAITrack.fields();
    expect(f.utm_source).toBe("google");
    expect(f.utm_medium).toBe("cpc");
    expect(f.gclid).toBe("abc123");
    expect(f.first_utm_source).toBe("google");
    expect(typeof f.pageview_count).toBe("number");
    expect(typeof f.session_count).toBe("number");
  });
});

describe("tracker — consent gate", () => {
  it("holds the visit in memory until consent is granted", () => {
    setLocation("https://www.example.com/?utm_source=twitter&utm_medium=social");
    loadTracker({ consent: "required" });
    // Nothing recorded yet.
    expect(localStorage.getItem("hai_first_touch")).toBeNull();
    // Grant consent → the held visit is replayed with its TRUE source.
    window.HAITrack.grantConsent();
    expect(JSON.parse(localStorage.getItem("hai_consent") || "null")).toBe(true);
    const state = window.HAITrack.get();
    expect(state.first?.channel).toBe("Organic Social");
  });

  it("revokeConsent wipes all keys", () => {
    setLocation("https://www.example.com/?utm_source=reddit&utm_medium=social");
    loadTracker();
    expect(localStorage.getItem("hai_visitor")).toBeTruthy();
    window.HAITrack.revokeConsent();
    expect(localStorage.getItem("hai_visitor")).toBeNull();
    expect(localStorage.getItem("hai_first_touch")).toBeNull();
  });
});

describe("tracker — beacon", () => {
  it("sends the pageview beacon to /api/visit with text/plain", async () => {
    const calls = stubBeacon();
    stubFetch();
    setLocation("https://www.holisticai.com/?utm_source=bing&utm_medium=cpc");
    const before = calls.length;
    loadTracker();
    // sendBeacon's Blob.text() resolves on a microtask — wait for it.
    await new Promise((r) => setTimeout(r, 30));
    const fresh = calls.slice(before).filter((c) => c.url.includes("/api/visit"));
    expect(fresh.length).toBeGreaterThanOrEqual(1);
    expect(fresh[0].url).toContain("/api/visit");
    const body = JSON.parse(fresh[0].body);
    expect(body.type).toBe("pageview");
    expect(body.channel).toBe("Paid Search");
    expect(body.params.utm_source).toBe("bing");
  });

  it("does not beacon when consent is required and not granted", async () => {
    const calls = stubBeacon();
    stubFetch();
    setLocation("https://www.holisticai.com/?utm_source=bing&utm_medium=cpc");
    const before = calls.length;
    loadTracker({ consent: "required" });
    await new Promise((r) => setTimeout(r, 30));
    const fresh = calls.slice(before).filter((c) => c.url.includes("/api/visit"));
    expect(fresh.length).toBe(0);
  });
});

describe("tracker — form activity", () => {
  it("activity is off unless data-activity=on", () => {
    loadTracker();
    expect(window.HAITrack.activity().enabled).toBe(false);
  });

  it("activity on reports enabled + consented", () => {
    loadTracker({ activity: "on" });
    const a = window.HAITrack.activity();
    expect(a.enabled).toBe(true);
    expect(a.consented).toBe(true);
  });
});
