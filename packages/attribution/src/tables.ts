/**
 * Channel taxonomy tables — ported verbatim from hai-track.js v2.0.0
 * (Holistic AI's shipped attribution tracker, lines 96–221 of the original).
 *
 * Source of truth: artifacts/hai-track.js in this repo.
 * Regex semantics are identical to the original — do not "improve" them
 * without updating the parity tests.
 */

export type HostRule = readonly [RegExp, string];

/**
 * Click IDs are the strongest paid signal: they survive missing or wrong UTMs,
 * which is the most common attribution failure in practice.
 * [param, [platform, channel]]
 */
export const CLICK_IDS: Record<string, readonly [string, string]> = {
  gclid: ["Google Ads", "Paid Search"],
  gbraid: ["Google Ads", "Paid Search"],
  wbraid: ["Google Ads", "Paid Search"],
  dclid: ["Google Display/YouTube", "Display"],
  msclkid: ["Microsoft Ads", "Paid Search"],
  fbclid: ["Meta", "Paid Social"],
  li_fat_id: ["LinkedIn Ads", "Paid Social"],
  ttclid: ["TikTok Ads", "Paid Social"],
  twclid: ["X Ads", "Paid Social"],
  rdt_cid: ["Reddit Ads", "Paid Social"],
  ScCid: ["Snapchat Ads", "Paid Social"],
  epik: ["Pinterest Ads", "Paid Social"],
  qclid: ["Quora Ads", "Paid Social"],
  tblci: ["Taboola", "Display"],
  dicbo: ["Outbrain", "Display"],
  irclickid: ["Impact", "Affiliate"],
  cjevent: ["Commission Junction", "Affiliate"],
  tduid: ["TradeDoubler", "Affiliate"],
  yclid: ["Yandex/Yahoo", "Paid Search"],
  mc_eid: ["Mailchimp", "Email"],
  mkt_tok: ["Marketo", "Email"],
  _hsenc: ["HubSpot", "Email"],
};

/**
 * AI assistants / answer engines. Checked BEFORE search engines, because
 * gemini.google.com would otherwise read as Google organic, and ChatGPT now
 * appends utm_source=chatgpt.com itself.
 * NOTE: 35–70% of AI referrals arrive with no referrer at all and are
 * indistinguishable from Direct. Revisit this list quarterly.
 */
export const AI: readonly HostRule[] = [
  [/(^|\.)chatgpt\.com$/, "ChatGPT"],
  [/(^|\.)chat\.openai\.com$/, "ChatGPT"],
  [/(^|\.)openai\.com$/, "OpenAI"],
  [/(^|\.)perplexity\.ai$/, "Perplexity"],
  [/(^|\.)claude\.ai$/, "Claude"],
  [/(^|\.)anthropic\.com$/, "Claude"],
  [/(^|\.)gemini\.google\.com$/, "Gemini"],
  [/(^|\.)bard\.google\.com$/, "Gemini"],
  [/(^|\.)aistudio\.google\.com$/, "Google AI Studio"],
  [/(^|\.)copilot\.microsoft\.com$/, "Microsoft Copilot"],
  [/(^|\.)edgeservices\.bing\.com$/, "Microsoft Copilot"],
  [/(^|\.)you\.com$/, "You.com"],
  [/(^|\.)poe\.com$/, "Poe"],
  [/(^|\.)phind\.com$/, "Phind"],
  [/(^|\.)deepseek\.com$/, "DeepSeek"],
  [/(^|\.)grok\.com$/, "Grok"],
  [/(^|\.)x\.ai$/, "Grok"],
  [/(^|\.)mistral\.ai$/, "Mistral"],
  [/(^|\.)meta\.ai$/, "Meta AI"],
  [/(^|\.)kagi\.com$/, "Kagi"],
  [/(^|\.)felo\.ai$/, "Felo"],
  [/(^|\.)genspark\.ai$/, "Genspark"],
  [/(^|\.)iask\.ai$/, "iAsk"],
];

export const SEARCH: readonly HostRule[] = [
  [/(^|\.)google\./, "Google"],
  [/(^|\.)bing\.com$/, "Bing"],
  [/(^|\.)duckduckgo\.com$/, "DuckDuckGo"],
  [/(^|\.)search\.yahoo\./, "Yahoo"],
  [/(^|\.)ecosia\.org$/, "Ecosia"],
  [/(^|\.)search\.brave\.com$/, "Brave"],
  [/(^|\.)startpage\.com$/, "Startpage"],
  [/(^|\.)baidu\.com$/, "Baidu"],
  [/(^|\.)yandex\./, "Yandex"],
  [/(^|\.)naver\.com$/, "Naver"],
  [/(^|\.)qwant\.com$/, "Qwant"],
];

export const SOCIAL: readonly HostRule[] = [
  [/(^|\.)linkedin\.com$/, "LinkedIn"],
  [/(^|\.)lnkd\.in$/, "LinkedIn"],
  [/(^|\.)facebook\.com$/, "Facebook"],
  [/(^|\.)instagram\.com$/, "Instagram"],
  [/(^|\.)t\.co$/, "X"],
  [/(^|\.)twitter\.com$/, "X"],
  [/(^|\.)x\.com$/, "X"],
  [/(^|\.)youtube\.com$/, "YouTube"],
  [/(^|\.)youtu\.be$/, "YouTube"],
  [/(^|\.)reddit\.com$/, "Reddit"],
  [/(^|\.)tiktok\.com$/, "TikTok"],
  [/(^|\.)news\.ycombinator\.com$/, "Hacker News"],
  [/(^|\.)medium\.com$/, "Medium"],
  [/(^|\.)substack\.com$/, "Substack"],
  [/(^|\.)threads\.(net|com)$/, "Threads"],
  [/(^|\.)quora\.com$/, "Quora"],
  [/(^|\.)slack\.com$/, "Slack"],
  [/(^|\.)teams\.microsoft\.com$/, "Microsoft Teams"],
];

/** A referral from webmail is an email click, not a website referral. */
export const WEBMAIL: readonly RegExp[] = [
  /(^|\.)mail\.google\.com$/,
  /(^|\.)outlook\.(live|office|office365)\.com$/,
  /(^|\.)mail\.yahoo\.com$/,
  /(^|\.)mail\.proton\.me$/,
];

/**
 * Our own hosts — self-referrals must not be counted as new acquisition.
 * Clone-side: extend via the SELF_EXTRA export for your own domains.
 */
export const SELF: readonly RegExp[] = [
  /(^|\.)holisticai\.com$/,
  /(^|\.)holisticai\.io$/,
  /(^|\.)webflow\.io$/,
  /^localhost$/,
];

/** Extra self hosts for the clone (your own domains). */
export const SELF_EXTRA: readonly RegExp[] = [];

export const ALL_SELF: readonly RegExp[] = [...SELF, ...SELF_EXTRA];

/** All 12 channels the tracker can emit. */
export const CHANNELS = [
  "Direct",
  "Organic Search",
  "Paid Search",
  "Paid Social",
  "Organic Social",
  "Display",
  "Email",
  "Affiliate",
  "Referral",
  "Campaign",
  "AI Assistant",
  "Internal",
] as const;

export type Channel = (typeof CHANNELS)[number];
