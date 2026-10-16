# Project Plan: "Holistic AI" Full Recreation

**Goal:** a working, deployable clone of holisticai.com + hai-brain (marketing site + first-party attribution platform), same architecture, same behavior, same contracts.
**Basis:** REA static analysis (Evidence `ev_a5ec5dbcc20ad8e4…`), passive CDP observation, full `hai-track.js` v2.0.0 source (812 lines), sitemap (758 URLs), API probing.
**Estimated effort:** ~6–8 weeks solo, ~3 weeks with 2 devs. Phases are ordered by dependency.

---

## 0. Scope & Substitution Decisions

Webflow, HubSpot forms, and Finsweet are proprietary/SaaS. "Exact same" = same architecture and behavior on open-source equivalents:

| Original | Replacement | Why |
|---|---|---|
| Webflow CMS | **Payload CMS 3** (self-hosted, Postgres) | Same collection/field model, admin UI, versioning |
| Webflow hosting + ix2 | **Next.js 15 App Router** on Vercel | Same SSR/ISR behavior; interactions via Framer Motion/GSAP |
| Webflow code-islands | React Server Components | Native |
| Finsweet fs-cc consent | Custom banner (or `react-cookie-consent`) | Same category-gated behavior |
| HubSpot | HubSpot API (keep — it's the real CRM contract) | Same webhook shape |
| Convex | **Convex** (keep — matches realtime needs) | Same schema pattern |
| Vercel form app | Vercel + Next.js (keep) | Same |
| Cloudflare | Cloudflare (keep) | Same headers/caching |
| jQuery 3.5.1 | none (drop) | Webflow artifact, not needed |

**Deliverable scope:** marketing site (758 pages across 15 collections), demo form embed, attribution engine (3 APIs + tracker + classifier), CRM integration, dashboards.

---

## 1. Monorepo Layout

```
holisticai-clone/
├── apps/
│   ├── web/                        # Next.js 15 — marketing site (Payload frontend)
│   │   ├── app/
│   │   │   ├── (marketing)/        # home, why-holisticai, about, careers, demo
│   │   │   │   ├── page.tsx
│   │   │   │   ├── about/page.tsx
│   │   │   │   ├── demo/page.tsx           # embeds hai-brain iframe
│   │   │   │   ├── thank-you/page.tsx
│   │   │   │   ├── thank-you-meeting-scheduled/page.tsx
│   │   │   │   ├── thank-you-meeting-not-scheduled/page.tsx
│   │   │   │   ├── checkout/page.tsx
│   │   │   │   └── order-confirmation/page.tsx
│   │   │   ├── blog/[slug]/page.tsx        # + /blog-category/, /type-of-blog/
│   │   │   ├── papers/[slug]/page.tsx      # + /paper-category/
│   │   │   ├── glossary/[slug]/page.tsx
│   │   │   ├── news/[slug]/page.tsx        # + /news-category/
│   │   │   ├── media-coverage/[slug]/page.tsx
│   │   │   ├── learn/[slug]/page.tsx
│   │   │   ├── events/[slug]/page.tsx      # + /event-category/
│   │   │   ├── newsletters/[slug]/page.tsx
│   │   │   ├── analyst-coverage/[slug]/page.tsx
│   │   │   ├── press-release/[slug]/page.tsx
│   │   │   ├── case-study/[slug]/page.tsx
│   │   │   ├── red-teaming/[slug]/page.tsx
│   │   │   ├── role/[slug]/page.tsx
│   │   │   ├── industry/[slug]/page.tsx
│   │   │   ├── use-case/[slug]/page.tsx
│   │   │   ├── model-categories/[slug]/page.tsx
│   │   │   ├── executive-bios/[slug]/page.tsx
│   │   │   ├── search/page.tsx
│   │   │   ├── sitemap.ts                  # generates 758 URLs
│   │   │   └── layout.tsx                  # scripts: hai-track, consent, fonts
│   │   ├── components/                     # design system (§3)
│   │   └── lib/
│   │       └── payload.ts
│   │
│   ├── hai-brain/                   # Next.js 15 — form app + attribution API
│   │   ├── app/
│   │   │   ├── f/[slug]/page.tsx            # embed form (embed=1 mode)
│   │   │   ├── api/
│   │   │   │   ├── lead/route.ts            # POST, zod email validation
│   │   │   │   ├── visit/route.ts           # POST, sendBeacon target
│   │   │   │   └── form-activity/route.ts   # POST, event stream
│   │   │   └── layout.tsx
│   │   ├── convex/
│   │   │   ├── schema.ts                    # visits, leads, formActivity
│   │   │   ├── attribution.ts               # server re-classification
│   │   │   └── visits.ts                    # record mutation
│   │   └── public/
│   │       └── hai-track.js                 # the tracker (ported, §5)
│   │
│   └── cms/                         # Payload CMS 3
│       ├── collections/
│       │   ├── Blog.ts  Papers.ts  Glossary.ts  News.ts  MediaCoverage.ts
│       │   ├── Learn.ts  Events.ts  Newsletters.ts  AnalystCoverage.ts
│       │   ├── PressRelease.ts  CaseStudy.ts  RedTeaming.ts
│       │   ├── Roles.ts  Industries.ts  UseCases.ts  ModelCategories.ts
│       │   └── ExecutiveBios.ts  Pages.ts  Forms.ts  Media.ts
│       └── payload.config.ts
│
├── packages/
│   ├── attribution/                 # shared TS classifier (ported from hai-track.js)
│   │   ├── src/
│   │   │   ├── classify.ts           # 12-channel precedence algorithm
│   │   │   ├── tables.ts             # AI, SEARCH, SOCIAL, WEBMAIL, SELF, CLICK_IDS
│   │   │   └── payload.ts            # visit/lead payload builders
│   │   └── package.json
│   ├── ui/                          # design tokens + primitives
│   │   ├── tokens.css                # --hai-* palette, Geist, spacing
│   │   └── components/               # Button, Section, Card, LogoWall…
│   └── eslint-config/ tsconfig/      # shared configs
│
├── infra/
│   ├── cloudflare/                  # headers rules, cache config
│   └── vercel.json                  # both apps
├── .github/workflows/ci.yml
├── turbo.json
└── pnpm-workspace.yaml
```

**Toolchain:** pnpm workspaces + Turborepo, TypeScript strict, ESLint + Prettier, Vitest (classifier tests), Playwright (embed form E2E).

---

## 2. Data Model (Convex — exact schema)

```ts
// apps/hai-brain/convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  visits: defineTable({
    visitorId: v.string(),          // 32-hex, localStorage hai_visitor
    sessionId: v.string(),
    type: v.string(),               // "pageview" | custom event
    isFirstTouch: v.boolean(),
    isNewSession: v.boolean(),
    consent: v.boolean(),
    channel: v.optional(v.string()),    // client classification
    platform: v.optional(v.string()),
    referrer: v.optional(v.string()),
    landingPage: v.optional(v.string()),
    pageTitle: v.optional(v.string()),
    params: v.any(),                // raw utm_* + click ids (server re-classifies)
    ts: v.string(),
    // server-added:
    serverChannel: v.optional(v.string()),  // re-classification (safety net)
    createdAt: v.number(),
  })
    .index("by_visitor", ["visitorId"])
    .index("by_ts", ["ts"]),

  leads: defineTable({
    email: v.string(),
    // last touch (converting visit)
    utmSource: v.optional(v.string()),
    utmMedium: v.optional(v.string()),
    utmCampaign: v.optional(v.string()),
    utmTerm: v.optional(v.string()),
    utmContent: v.optional(v.string()),
    referrer: v.optional(v.string()),
    landingPage: v.optional(v.string()),
    gclid: v.optional(v.string()),
    // first touch
    firstUtmSource: v.optional(v.string()),
    firstUtmMedium: v.optional(v.string()),
    firstUtmCampaign: v.optional(v.string()),
    firstReferrer: v.optional(v.string()),
    firstLandingPage: v.optional(v.string()),
    firstSeenAt: v.optional(v.string()),
    // engagement before converting
    pageviewCount: v.optional(v.number()),
    sessionCount: v.optional(v.number()),
    // form identity
    formName: v.optional(v.string()),
    formId: v.optional(v.string()),
    formPageUrl: v.optional(v.string()),
    pageTitle: v.optional(v.string()),
    // click id forwarded under its real param name
    clickId: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_createdAt", ["createdAt"]),

  formActivity: defineTable({
    sessionId: v.string(),
    email: v.optional(v.string()),   // captured once it parses
    pagePath: v.string(),
    formName: v.optional(v.string()),
    events: v.array(v.object({
      type: v.string(),              // focus | input | blur
      field: v.string(),
      filled: v.boolean(),
      length: v.number(),
      value: v.optional(v.string()), // ONLY allowlisted menu fields
      at: v.number(),
    })),
    createdAt: v.number(),
  })
    .index("by_session", ["sessionId"])
    .index("by_createdAt", ["createdAt"]),

  forms: defineTable({
    slug: v.string(),                // "demo-request-ux7tu"
    title: v.string(),
    fields: v.any(),                 // field config (JSON)
    theme: v.optional(v.any()),      // --f-* overrides
    minHeight: v.optional(v.number()),
    active: v.boolean(),
  }).index("by_slug", ["slug"]),
});
```

**HubSpot sync:** on lead insert, POST to HubSpot contacts API with attribution as custom properties: `first_touch_utm_source`, `last_touch_channel`, `pageview_count`, `session_count`, etc.

---

## 3. Design System

```css
/* packages/ui/tokens.css */
:root {
  --hai-blurple:  #5049f9;
  --hai-amethyst: #ab5fce;
  --hai-cerulean: #36b1fe;
  --hai-deepblue: #10131c;
  --light-grey:   #e7e8ec;
  --light-purple: #ded9f9;
  --soft-purple:  #f6f5fd;
  --text:         #262525;

  --font-sans: "Geist", system-ui, -apple-system, sans-serif;
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
  --space-6: 24px; --space-8: 32px; --space-10: 40px; --space-12: 48px;
  --space-16: 64px; --space-24: 96px;
  --page-margin: 32px;              /* 16px mobile */
  --content-max: 1200px;
}
```

Form-app theming (exact token names from the original):
```css
--f-page --f-card --f-text --f-label --f-muted --f-placeholder --f-border
--f-input-bg --f-accent(#5049F9) --f-accent-text --f-radius(9px)
--f-card-radius(14px) --f-card-border --f-shadow
--f-title-size --f-button-radius --f-weight --f-max-width --f-link --f-layout
```
Theme presets: `light` / `dark`; query overrides: `?theme=dark&accent=%23fff&layout=two-column&card=false&maxWidth=720`.

Components to build: Section, Container, Button (primary/secondary), Card, Accordion, LogoWall (federated SSR + hydration), Marquee, Counter, Badge (Gartner "Challenger" pill), Table, Footer, Nav (mega-menu), Breadcrumbs, Search UI, Pagination, ConsentBanner.

---

## 4. Phased Build Plan

### Phase 0 — Foundations (3–4 days)
- [ ] pnpm monorepo + Turborepo + TS strict + shared configs
- [ ] `packages/ui` tokens + 3 primitives
- [ ] Convex project init; `schema.ts` deployed (dev)
- [ ] Vercel projects: `web`, `hai-brain`; env vars scaffold
- [ ] CI: lint + typecheck + unit tests on PR
- **Done when:** `pnpm build` passes, Convex dev deploy green.

### Phase 1 — CMS + content model (1 week)
- [ ] Payload config with all 15 collections + Pages + Media + Forms
- [ ] Fields per collection (title, slug, SEO block, body(lexical), cover, categories, authors, dates)
- [ ] Taxonomies: blog-category, type-of-blog, news-category, event-category, paper-category, model-categories, roles, industries, use-cases
- [ ] Seed script: import 758 URLs structure from the analyzed sitemap (content itself: placeholder or scrape public pages — respect robots)
- [ ] Draft/preview + versioning on
- **Done when:** admin UI lists all collections; one blog post renders at `/blog/<slug>`.

### Phase 2 — Marketing shell (1 week)
- [ ] Root layout: Geist via next/font, header nav, footer, global SEO defaults
- [ ] Home page sections: hero, "Govern AI across your enterprise", stats band (63% IBM / €35M EU AI Act / +$670K IBM breach / 8–16 weeks), integrations grid, inventory demo card, risk management, testimonials, logo wall (SSR island), CTA
- [ ] Static pages: about, careers, why-holisticai, trust-center, integrations, brand-assets, privacy-policy, terms-conditions, hai-lab, ai-tracker, guardian-agents, identify/protect/enforce cluster
- [ ] `/search` (Payload search endpoint + UI)
- [ ] `sitemap.ts` generating all 758 URLs + robots.txt (disallow `*_page=`, `*__hstc=`, `*__hssc=`, `*__hsfp=`)
- **Done when:** all static routes 200, sitemap matches original count.

### Phase 3 — Collection pages (1 week)
- [ ] Generic collection page template (dynamic route per collection, ISR)
- [ ] Category/archive pages with pagination (`?page=`)
- [ ] Persona/industry/use-case templates (same shell, different content blocks)
- [ ] `generateStaticParams` + `revalidate` for top pages
- **Done when:** `/blog`, `/glossary/ai-bias`, `/role/cto`, `/red-teaming/chatgpt-4-5…` render with real CMS data.

### Phase 4 — hai-brain form app (4–5 days)
- [ ] `/f/[slug]` route: loads form config from Convex; renders fields (name, email, select intent, textarea 10–200 with counter, consent checkbox pre-checked)
- [ ] `embed=1` detection: adds `.embed` class; iframe height → `postMessage({type:'hai-form-height', slug, height}, '*')` on ResizeObserver
- [ ] Theme system: `?theme`, `?card`, per-token overrides with validation (regex-validated color/num/font); `window.__haiApplyTheme(obj)` runtime API
- [ ] Client validation: zod schema mirroring server; email regex `/^[^@\s]+@[^@\s]+\.[^@\s]+$/`
- [ ] Submit → POST /api/lead; success/error states; hidden attribution fields prefilled by tracker
- **Done when:** form submits end-to-end in embed mode; height messages received by parent.

### Phase 5 — Attribution engine (1.5 weeks) ← the core
- [ ] Port `packages/attribution/tables.ts`: AI (20+ hosts), SEARCH (11), SOCIAL (18), WEBMAIL (4), SELF (4), CLICK_IDS (15) — exact regexes from source
- [ ] Port `classify.ts`: precedence AI → utm_medium → click ID → referrer host → Direct; `out(channel, platform)` shape; self-referral exclusion
- [ ] Port `payload.ts`: visit payload + lead fields (first/last touch + counts) + form context (formName heuristics: explicit → aria-label → submit text → nearest heading → "Website form")
- [ ] Port tracker `apps/hai-brain/public/hai-track.js`:
  - visitorId (crypto.getRandomValues 16 bytes → hex)
  - session: 30-min inactivity window; counts: pageviews/sessions
  - first-touch retention 400 days
  - beacon: `sendBeacon(API + "/api/visit", Blob([body],{type:"text/plain"}))` — **text/plain mandatory** (application/json breaks sendBeacon preflight)
  - form activity: queue (focus/input/blur, field, filled, length, value only for `{intent, plan, team_size, topic}`), flush on 20 events / 4s idle / unload / explicit; `composedPath()[0]` for shadow DOM
  - hidden-field mirroring + MutationObserver for late forms
  - SPA: patch `history.pushState/replaceState` + `popstate` → pageview without re-attribution
  - consent gate: `data-consent="required"` → hold `state.pending`; `grantConsent()` replays held visit
  - public API: get/fields/channel/formName/fill/track/activity/flushActivity/grantConsent/revokeConsent/version
- [ ] `POST /api/lead`: zod email → Convex insert → HubSpot contact upsert (attribution as custom props)
- [ ] `POST /api/visit`: Convex insert + **server re-classification** (safety net)
- [ ] `POST /api/form-activity`: Convex insert; server strips non-allowlisted values again
- **Done when:** unit tests pass for classifier (all 12 channels, edge cases: gemini via AI not search, webmail→Email, self→excluded); full tracker integration test in Playwright.

### Phase 6 — Integrations (3–4 days)
- [ ] Consent banner (category-gated: analytics/marketing/functional) → calls `HAITrack.grantConsent()` on accept
- [ ] **Ship default:** tracker loads WITH `data-consent="required"` (unlike original — fix the privacy flag) OR match original exactly per your call; document the choice
- [ ] HubSpot tracking script (EU region equivalent) + lead sync
- [ ] Demo page embeds `/f/demo-request-<random>` iframe with `data-hai-form` slug + `data-hai-min-height`
- [ ] Thank-you pages + checkout/order-confirmation flow
- **Done when:** lead submitted on /demo appears in Convex + HubSpot with full attribution; consent banner gates all tracking.

### Phase 7 — Infrastructure (2–3 days)
- [ ] Cloudflare: proxied DNS, HSTS preload (`max-age=31536000; includeSubDomains; preload`), CSP `frame-ancestors 'self'`, X-Frame-Options SAMEORIGIN
- [ ] Cache rules: HTML `s-maxage=432000` (5 days), assets immutable content-hashed
- [ ] Vercel envs, custom domains, preview deploys
- [ ] Rate limiting on all 3 APIs (Upstash or Vercel KV) — original has none; add it
- [ ] Observability: Vercel logs + Convex dashboard + uptime check on /api/visit
- **Done when:** headers match original; load test passes 100 rps on /api/visit.

### Phase 8 — Analytics dashboard (3–4 days)
- [ ] Convex queries: per-channel conversion (visit → lead), AI-referral volume, first-vs-last-touch shift, form abandonment funnel (from formActivity events)
- [ ] Simple internal dashboard (or Metabase/Grafana on Convex export)
- **Done when:** "channel X: N visits → M leads, conversion %" query works.

### Phase 9 — Hardening & parity checks (2–3 days)
- [ ] Playwright: embed form resize messages, shadow-DOM form fill, consent flow, SPA nav counting
- [ ] Security: zod on all inputs, email validation server-side (original only checks email — keep + extend), CORS on hai-brain (`*` originally — tighten to your domains)
- [ ] Perf: LCP < 2.5s on home, form iframe < 100ms TTFB
- [ ] **Parity checklist vs original:** 758 sitemap URLs, 15 collections, 3 API contracts byte-compatible, 12 channels + 15 click IDs, storage keys (`hai_visitor` etc.), tracker version "2.0.0"
- **Done when:** parity checklist 100%.

---

## 5. Critical Code Ports (start here)

### 5.1 Classifier (packages/attribution/src/tables.ts) — port verbatim
Exact tables from the original source (already extracted):

```ts
export const AI: [RegExp, string][] = [
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
  // "Revisit quarterly" — extend as new assistants appear
];

export const CLICK_IDS: Record<string, [string, string]> = {
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
  qclid: ["Quora Ads", "Paid Search"],
  tblci: ["Taboola", "Display"],
  dicbo: ["Outbrain", "Display"],
  irclickid: ["Impact", "Affiliate"],
};

export const SEARCH: [RegExp, string][] = [
  [/(^|\.)google\./, "Google"], [/(^|\.)bing\.com$/, "Bing"],
  [/(^|\.)duckduckgo\.com$/, "DuckDuckGo"], [/(^|\.)search\.yahoo\./, "Yahoo"],
  [/(^|\.)ecosia\.org$/, "Ecosia"], [/(^|\.)search\.brave\.com$/, "Brave"],
  [/(^|\.)startpage\.com$/, "Startpage"], [/(^|\.)baidu\.com$/, "Baidu"],
  [/(^|\.)yandex\./, "Yandex"], [/(^|\.)naver\.com$/, "Naver"],
  [/(^|\.)qwant\.com$/, "Qwant"],
];

export const SOCIAL: [RegExp, string][] = [
  [/(^|\.)linkedin\.com$/, "LinkedIn"], [/(^|\.)lnkd\.in$/, "LinkedIn"],
  [/(^|\.)facebook\.com$/, "Facebook"], [/(^|\.)instagram\.com$/, "Instagram"],
  [/(^|\.)t\.co$/, "X"], [/(^|\.)twitter\.com$/, "X"], [/(^|\.)x\.com$/, "X"],
  [/(^|\.)youtube\.com$/, "YouTube"], [/(^|\.)youtu\.be$/, "YouTube"],
  [/(^|\.)reddit\.com$/, "Reddit"], [/(^|\.)tiktok\.com$/, "TikTok"],
  [/(^|\.)news\.ycombinator\.com$/, "Hacker News"], [/(^|\.)medium\.com$/, "Medium"],
  [/(^|\.)substack\.com$/, "Substack"], [/(^|\.)threads\.(net|com)$/, "Threads"],
  [/(^|\.)quora\.com$/, "Quora"], [/(^|\.)slack\.com$/, "Slack"],
  [/(^|\.)teams\.microsoft\.com$/, "Microsoft Teams"],
];

export const WEBMAIL: RegExp[] = [
  /(^|\.)mail\.google\.com$/,
  /(^|\.)outlook\.(live|office|office365)\.com$/,
  /(^|\.)mail\.yahoo\.com$/,
  /(^|\.)mail\.proton\.me$/,
];

export const SELF: RegExp[] = [
  /(^|\.)holisticai\.com$/, /(^|\.)holisticai\.io$/,
  /(^|\.)webflow\.io$/, /^localhost$/,
];
```
(Full file with `qclid` corrected to `["Quora Ads", "Paid Search"]`.)

### 5.2 classify.ts — the precedence algorithm
```ts
export function classify(v: {
  utm_medium?: string; utm_source?: string; referrer?: string;
  click_id_param?: string; click_id?: string;
}): { channel: string; platform: string | null } {
  const med = String(v.utm_medium || "").toLowerCase();
  const src = String(v.utm_source || "").toLowerCase();
  const ref = hostOf(v.referrer);
  const click = v.click_id_param ? CLICK_IDS[v.click_id_param] : undefined;
  const out = (channel: string, platform?: string | null) => ({
    channel,
    platform: platform ?? (click ? click[0] : null) ?? null,
  });

  // 1. AI FIRST — before search, so gemini.google.com isn't Google organic
  const ai = lookup(AI, ref) || lookup(AI, hostOf("https://" + src)) || lookup(AI, src);
  if (med === "ai" || med === "ai-assistant" || ai) return out("AI Assistant", ai ?? src ?? null);

  // 2. explicit utm_medium
  if (med) {
    if (/^(cpc|ppc|paid|paidsearch|paid-search|paid_search|sem|adwords)$/.test(med)) return out("Paid Search", src);
    if (/^(paidsocial|paid-social|paid_social)$/.test(med)) return out("Paid Social", src);
    if (/^(display|banner|cpm|programmatic|native)$/.test(med)) return out("Display", src);
    if (/^(social|social-media|social_media|organic-social)$/.test(med)) {
      const paid = click && click[1] === "Paid Social";
      return out(paid ? "Paid Social" : "Organic Social", src);
    }
    if (/^(email|newsletter)$/.test(med)) return out("Email", src);
    if (/^(affiliate)$/.test(med)) return out("Affiliate", src);
    if (/^(referral)$/.test(med)) return out("Referral", src);
    if (/^(internal)$/.test(med)) return out("Internal", src);
  }

  // 3. click ID
  if (click) return out(click[1], click[0]);

  // 4. referrer host
  if (ref && !isSelf(ref)) {
    const se = lookup(SEARCH, ref);
    if (se) return out("Organic Search", se);
    const so = lookup(SOCIAL, ref);
    if (so) return out("Organic Social", so);
    if (WEBMAIL.some((r) => r.test(ref))) return out("Email", null);
    return out("Referral", ref);
  }

  // 5. Direct
  return out("Direct", null);
}
```
Helpers: `hostOf` (strip www, lowercase), `lookup` (first regex match), `isSelf`.

### 5.3 API route (apps/hai-brain/app/api/lead/route.ts)
```ts
import { z } from "zod";
import { api } from "@/convex/_generated/api";
import { ConvexHttpClient } from "convex/browser";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const leadSchema = z.object({
  email: z.string().regex(EMAIL, "A valid email is required."),
  utm_source: z.string().nullish(),
  utm_medium: z.string().nullish(),
  utm_campaign: z.string().nullish(),
  utm_term: z.string().nullish(),
  utm_content: z.string().nullish(),
  referrer: z.string().nullish(),
  landing_page: z.string().nullish(),
  gclid: z.string().nullish(),
  first_utm_source: z.string().nullish(),
  first_utm_medium: z.string().nullish(),
  first_utm_campaign: z.string().nullish(),
  first_referrer: z.string().nullish(),
  first_landing_page: z.string().nullish(),
  first_seen_at: z.string().nullish(),
  pageview_count: z.number().nullish(),
  session_count: z.number().nullish(),
  form_name: z.string().nullish(),
  form_id: z.string().nullish(),
  form_page_url: z.string().nullish(),
  page_title: z.string().nullish(),
}).passthrough(); // click id under its real param name

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, error: "A valid email is required." }, { status: 400 });
  }
  const data = parsed.data;
  const serverChannel = classify({
    utm_medium: data.utm_medium ?? undefined,
    utm_source: data.utm_source ?? undefined,
    referrer: data.referrer ?? undefined,
  }).channel;

  await convex.mutation(api.leads.create, { ...data, serverChannel, createdAt: Date.now() });
  await syncHubSpot(data); // contacts upsert with attribution custom props
  return Response.json({ ok: true });
}
```
`/api/visit` and `/api/form-activity` follow the same shape (no email requirement; form-activity strips values outside the allowlist server-side again).

### 5.4 The beacon (the trap to avoid)
```js
// MUST stay text/plain — application/json makes this a non-simple request,
// sendBeacon cannot preflight, and it silently drops the body.
navigator.sendBeacon(url, new Blob([body], { type: "text/plain" }));
// fallback: fetch(url, { method: "POST", headers: {"Content-Type":"application/json"},
//                        body, keepalive: true }).catch(() => {});
```

### 5.5 Embed contract (parent page)
```html
<div data-hai-form="demo-request-ux7tu" data-hai-min-height="560">
  <iframe src="https://<hai-brain>/f/demo-request-ux7tu?embed=1"
          title="Schedule a demo with Holistic AI"
          referrerpolicy="no-referrer-when-downgrade"
          scrolling="no" style="width:100%;border:0;min-height:560px;background:transparent">
  </iframe>
</div>
```
```js
// inside iframe: report height (ResizeObserver → postMessage)
postMessage({ type: "hai-form-height", slug: "demo-request-ux7tu", height: v }, "*");
```

### 5.6 Consent gating (the fix vs original)
```html
<script src="https://<hai-brain>/hai-track.js" data-consent="required" defer></script>
```
```js
// cookie banner, on accept:
window.HAITrack?.grantConsent();
```
On reject: nothing loads; arrival visit is held in memory and only recorded on grant (true source, not self-referral).

---

## 6. Content Migration

- Sitemap (758 URLs) is the source of truth for route structure — already extracted.
- Collection field mapping: scrape public pages per collection (title, body, cover, dates, categories) into Payload seed fixtures; respect `robots.txt` and rate limits; or hand-author if content is being replaced anyway.
- Media: download assets from `cdn.prod.website-files.com` (content-hashed; same URL pattern in Payload media).
- Redirects map: old Webflow URLs → new Next.js routes (identical slugs → no redirects needed).

---

## 7. Risks & Open Decisions

| Risk | Mitigation |
|---|---|
| Webflow ix2 interactions (3 MB chunk) hard to replicate exactly | Rebuild only interactions actually used; GSAP/Framer Motion for the rest |
| Convex cold-start latency on beacons | sendBeacon is fire-and-forget; acceptable by design |
| HubSpot EU data residency | Use EU portal region; document in DPIA |
| Consent gating changes metrics vs original | Ship gated (GDPR-correct); note the behavioral delta in analytics |
| 758 pages content parity | Seed structure first, content second; routes exist before content |
| Beacon spam / no rate limits in original | Add Upstash rate limiting in Phase 7 |

**Open decision for you:** exact consent behavior — match original (tracking runs ungated, `data-consent` absent) or ship the gated version (`data-consent="required"`). The gated version is GDPR-correct; the ungated one is metric-complete.

---

## 8. Definition of Done (parity checklist)

- [ ] All 758 sitemap URLs resolve (same slugs)
- [ ] 15 CMS collections + taxonomies in admin
- [ ] Demo form embeds via iframe, submits to /api/lead, lands in Convex + HubSpot with first+last touch
- [ ] /api/visit, /api/form-activity, /api/lead contracts byte-compatible with originals
- [ ] Classifier: 12 channels, 15 click IDs, AI-first precedence — unit-tested
- [ ] Storage keys identical: hai_visitor, hai_first_touch, hai_last_touch, hai_session, hai_counts, hai_consent, hai_queue
- [ ] Tracker exposes window.HAITrack v2.0.0 API surface
- [ ] Cloudflare headers match: HSTS preload, CSP frame-ancestors 'self', X-Frame-Options, 5-day HTML cache
- [ ] Design tokens match (--hai-blurple #5049f9, Geist, 1200px grid)
- [ ] Consent banner gates all tracking (if gated variant chosen)
