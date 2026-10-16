import { describe, expect, it } from "vitest";
import { formContext, leadFields, visitBeacon } from "../src/payload.js";

const visit = {
  utm_source: "google",
  utm_medium: "cpc",
  utm_campaign: "spring",
  referrer: "https://google.com/",
  landing_page: "https://x.com/blog/a",
  ts: "2026-10-01T09:00:00.000Z",
  click_id_param: "gclid",
  click_id: "abc123",
};

describe("leadFields — /api/lead payload", () => {
  it("last touch + first touch + engagement", () => {
    const out = leadFields({
      first: visit,
      last: visit,
      counts: { pageviews: 7, sessions: 3 },
    });
    expect(out).toMatchObject({
      utm_source: "google",
      utm_medium: "cpc",
      first_utm_source: "google",
      first_seen_at: "2026-10-01T09:00:00.000Z",
      pageview_count: 7,
      session_count: 3,
    });
  });

  it("forwards click ID under its real param name", () => {
    const out = leadFields({ first: visit, last: visit, counts: { pageviews: 1, sessions: 1 } });
    expect(out.gclid).toBe("abc123");
  });

  it("nulls when no attribution state", () => {
    const out = leadFields({ first: null, last: null, counts: { pageviews: 0, sessions: 0 } });
    expect(out.utm_source).toBeNull();
    expect(out.first_utm_source).toBeNull();
    expect(out.pageview_count).toBe(0);
  });
});

describe("visitBeacon — /api/visit payload", () => {
  it("shape matches server contract", () => {
    const body = visitBeacon({
      visitorId: "abc",
      sessionId: "s1",
      isFirstTouch: true,
      isNewSession: true,
      consent: true,
      current: { ...visit, channel: "Paid Search", platform: "Google Ads" },
      last: visit,
      pageTitle: "A".repeat(300),
    });
    expect(body).toMatchObject({
      type: "pageview",
      visitorId: "abc",
      channel: "Paid Search",
      platform: "Google Ads",
      isFirstTouch: true,
    });
    expect(body.pageTitle.length).toBe(200); // sliced
    expect(body.params).toEqual({
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "spring",
      utm_term: null,
      utm_content: null,
      gclid: "abc123",
    });
    expect(typeof body.ts).toBe("string");
  });
});

describe("formContext", () => {
  it("returns form identity fields", () => {
    expect(
      formContext({
        formName: "demo-request-ux7tu",
        formId: "demo-request-ux7tu",
        pageUrl: "https://x.com/demo",
        pageTitle: "Demo",
      }),
    ).toEqual({
      form_name: "demo-request-ux7tu",
      form_id: "demo-request-ux7tu",
      form_page_url: "https://x.com/demo",
      page_title: "Demo",
    });
  });
});
