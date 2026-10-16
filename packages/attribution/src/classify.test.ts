import { describe, expect, it } from "vitest";
import { classify, hasSignal } from "../src/classify.js";

describe("classify — precedence (parity with hai-track.js v2.0.0)", () => {
  it("AI referrer beats search engine (gemini.google.com is NOT Google organic)", () => {
    expect(classify({ referrer: "https://gemini.google.com/" }).channel).toBe("AI Assistant");
    expect(classify({ referrer: "https://gemini.google.com/" }).platform).toBe("Gemini");
  });

  it("AI via utm_source", () => {
    expect(classify({ utm_source: "chatgpt.com" }).channel).toBe("AI Assistant");
  });

  it("explicit utm_medium=ai", () => {
    expect(classify({ utm_medium: "ai" })).toEqual({ channel: "AI Assistant", platform: null });
  });

  it("explicit utm_medium=cpc", () => {
    expect(classify({ utm_medium: "cpc", utm_source: "google" })).toEqual({
      channel: "Paid Search",
      platform: "google",
    });
  });

  it("click ID beats referrer (gclid over google.com)", () => {
    expect(classify({ click_id_param: "gclid", click_id: "abc", referrer: "https://google.com/" })).toEqual({
      channel: "Paid Search",
      platform: "Google Ads",
    });
  });

  it("webmail referrer → Email (Webmail), not Referral", () => {
    expect(classify({ referrer: "https://mail.google.com/" })).toEqual({
      channel: "Email",
      platform: "Webmail",
    });
  });

  it("self referrer → Internal, not Direct", () => {
    expect(classify({ referrer: "https://www.holisticai.com/other" })).toEqual({
      channel: "Internal",
      platform: null,
    });
  });

  it("organic search", () => {
    expect(classify({ referrer: "https://duckduckgo.com/?q=x" })).toEqual({
      channel: "Organic Search",
      platform: "DuckDuckGo",
    });
  });

  it("organic social", () => {
    expect(classify({ referrer: "https://www.linkedin.com/" })).toEqual({
      channel: "Organic Social",
      platform: "LinkedIn",
    });
  });

  it("unknown referrer → Referral with host", () => {
    expect(classify({ referrer: "https://some-random-blog.com/" })).toEqual({
      channel: "Referral",
      platform: "some-random-blog.com",
    });
  });

  it("Direct with nothing", () => {
    expect(classify({})).toEqual({ channel: "Direct", platform: null });
  });

  it("paid social via utm_medium=paidsocial", () => {
    expect(classify({ utm_medium: "paidsocial", utm_source: "meta" }).channel).toBe("Paid Social");
  });

  it("utm_medium=social + click id → Paid Social", () => {
    expect(classify({ utm_medium: "social", click_id_param: "fbclid", click_id: "x" }).channel).toBe(
      "Paid Social",
    );
  });

  it("utm_medium=organic → Organic Search", () => {
    expect(classify({ utm_medium: "organic" }).channel).toBe("Organic Search");
  });

  it("unrecognised utm_medium → Campaign (tagged but not lost)", () => {
    expect(classify({ utm_medium: "webinar", utm_source: "acme" })).toEqual({
      channel: "Campaign",
      platform: "acme",
    });
  });

  it("utm_campaign without medium → Campaign", () => {
    expect(classify({ utm_campaign: "spring" }).channel).toBe("Campaign");
  });

  it("utm_medium=referral → Referral", () => {
    expect(classify({ utm_medium: "referral", utm_source: "partner-site" })).toEqual({
      channel: "Referral",
      platform: "partner-site",
    });
  });

  it("utm_medium=newsletter → Email", () => {
    expect(classify({ utm_medium: "newsletter" }).channel).toBe("Email");
  });

  it("utm_medium=partner → Affiliate", () => {
    expect(classify({ utm_medium: "partner" }).channel).toBe("Affiliate");
  });

  it("webmail via outlook", () => {
    expect(classify({ referrer: "https://outlook.office365.com/" }).platform).toBe("Webmail");
  });

  it("www prefix stripped for referrer matching", () => {
    expect(classify({ referrer: "https://www.bing.com/" }).channel).toBe("Organic Search");
  });

  it("all 23 click IDs map to a channel", () => {
    const ids = [
      "gclid", "gbraid", "wbraid", "dclid", "msclkid", "fbclid", "li_fat_id", "ttclid",
      "twclid", "rdt_cid", "ScCid", "epik", "qclid", "tblci", "dicbo", "irclickid",
      "cjevent", "tduid", "yclid", "mc_eid", "mkt_tok", "_hsenc",
    ];
    for (const p of ids) {
      const c = classify({ click_id_param: p, click_id: "v" });
      expect(c.channel).toBeTruthy();
      expect(c.platform).toBeTruthy();
    }
    expect(classify({ click_id_param: "mc_eid", click_id: "v" }).channel).toBe("Email");
    expect(classify({ click_id_param: "cjevent", click_id: "v" }).channel).toBe("Affiliate");
    expect(classify({ click_id_param: "yclid", click_id: "v" }).channel).toBe("Paid Search");
  });

  it("platform falls back to click platform when not explicit", () => {
    expect(classify({ click_id_param: "msclkid", click_id: "v" }).platform).toBe("Microsoft Ads");
  });
});

describe("hasSignal", () => {
  it("true with any attribution signal", () => {
    expect(hasSignal({ utm_source: "x" })).toBe(true);
    expect(hasSignal({ utm_medium: "cpc" })).toBe(true);
    expect(hasSignal({ utm_campaign: "c" })).toBe(true);
    expect(hasSignal({ click_id_param: "gclid" })).toBe(true);
    expect(hasSignal({ referrer: "https://x.com" })).toBe(true);
  });
  it("false with nothing", () => {
    expect(hasSignal({})).toBe(false);
  });
});
