# Holistic AI — Complete Tech Stack & System Recreation Spec

**Target:** holisticai.com (marketing site + first-party attribution platform)
**Evidence basis:** REA static analysis of shipped bundles (Evidence ID `ev_a5ec5dbcc20ad8e4ea504cffb94…`, root SHA-256 `4ca8b690…31ff8`), passive CDP observation of the live page, HTTP inspection of hai-brain.vercel.app, sitemap enumeration (758 URLs), and full source review of `hai-track.js` (812 lines, v2.0.0).
**Honesty note:** everything below is *observed* from shipped artifacts. Server internals of hai-brain (Convex functions, route handlers) are inferred from the tracker's documented contract — they were never executed or read. Where something is inferred, it says so.

---

## 1. System Overview

The site is **two systems**, not one:

```
┌─────────────────────────────────────────────────────────────┐
│  A. MARKETING SITE — Webflow + Cloudflare + HubSpot          │
│     www.holisticai.com (758 pages, CMS-driven)               │
│     └─ Cloudflare (edge/CDN/WAF) → Webflow Lambda (us-east-1) │
│     └─ HubSpot (CRM, EU portal 25785988)                     │
│     └─ Finsweet (cookie consent, components)                 │
└──────────────────────────┬──────────────────────────────────┘
                           │ embeds (iframe + <script>)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  B. "HAI BRAIN" — Vercel-hosted attribution platform         │
│     hai-brain.vercel.app                                     │
│     ├─ Next.js 15+ (Turbopack, App Router) form app          │
│     │   /f/<form-slug>?embed=1  (embed iframe)               │
│     │   POST /api/lead (validated: "A valid email required") │
│     │   POST /api/visit (pageview beacon)                    │
│     │   POST /api/form-activity (pre-submit telemetry)       │
│     ├─ Convex (realtime DB — convex/attribution.ts,          │
│     │   convex/visits.record — server-side re-classification)│
│     └─ hai-track.js v2.0.0 (the client library, 35 KB)       │
└─────────────────────────────────────────────────────────────┘
```

The core idea: HubSpot only sees *converted* visitors. hai-track solves the attribution gap — it captures traffic source at arrival, keeps first-touch AND last-touch in localStorage, and attaches both to the lead when the form submits.

---

## 2. Infrastructure Layer

### 2.1 Edge / CDN / Hosting

| Component | Provider | Evidence |
|---|---|---|
| CDN + WAF + TLS | Cloudflare | `Server: cloudflare`, `CF-Ray`, `CF-Cache-Status: HIT`, HSTS preload |
| Origin (site) | Webflow hosting | `x-lambda-id`, `x-wf-region: us-east-1`, `surrogate-key: pageId:…` |
| Assets | `cdn.prod.website-files.com` | Webflow CDN, SRI integrity hashes on CSS |
| Form/API app | Vercel | `Server: Vercel`, `_next/static/chunks/*` with Turbopack hashes |
| Database | Convex | Referenced in hai-track.js comments: `convex/attribution.ts`, `convex/visits.record` |
| CRM | HubSpot (EU) | `js-eu1.hs-scripts.com/25785988.js` |
| Fonts | Google Fonts (Geist) | `fonts.googleapis.com/css2?family=Geist:wght@100..900` |

**Response headers observed on holisticai.com:**
```
HTTP/1.1 200 OK
Server: cloudflare
CF-Cache-Status: HIT; Age: 262405
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
content-security-policy: frame-ancestors 'self'
x-frame-options: SAMEORIGIN
surrogate-control: max-age=432000
Vary: accept-encoding
alt-svc: h3=":443"; ma=86400
```
Cache strategy: HTML has ~5-day edge cache (`surrogate-control: max-age=432000`), assets on `cdn.prod.website-files.com` with `Age` in the hundreds of thousands of seconds (permanent, content-hashed).

### 2.2 Recreation recipe (infra)

```
DNS + CDN:     Cloudflare (proxied, HSTS preload, CSP frame-ancestors 'self')
Marketing CMS: Webflow Business (site ID 6305e5d42c283515c3e71b8c, domain www.holisticai.com)
Form/API:      Vercel — Next.js 15 App Router + Turbopack
Database:      Convex (or any realtime DB; tables: visits, leads, form_activity)
CRM:           HubSpot EU portal (or swap for Salesforce/HubSpot free — the contract is just webhook-shaped)
Consent:       Finsweet fs-cc or OneTrust
```

---

## 3. Marketing Site (Webflow) — Full Stack

### 3.1 Load order (exact, from index.html)

```
1.  <link>  cdn.prod.website-files.com/…/holisticai.webflow.shared.42da0e2b0.min.css   (SRI, preloaded)
2.  <script> ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js        (font loader)
3.  <script> cdn.jsdelivr.net/npm/@finsweet/cookie-consent@1/fs-cc.js       (consent banner)
4.  <script> //js-eu1.hs-scripts.com/25785988.js                             (HubSpot tracking)
5.  <script> …/finsweetcomponentsconfig-1.0.6.js                             (Finsweet components config)
6.  <script> d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min…             (Webflow's jQuery)
7.  <script> …/webflow.schunk.181a2070a530b302.js                            (webpack chunk 970)
8.  <script> …/webflow.schunk.e5bccccbc093acec.js                            (webpack chunk 816)
9.  <script> …/webflow.a5cd9ab0.380c091832ba07b6.js                          (webpack bootstrap)
10. <script> cdnjs…/js-cookie/2.2.1/js.cookie.min.js                         (cookie helper)
11. <script> hai-brain.vercel.app/hai-track.js  data-hai-activity="on"       (attribution — see §5)
12. <script> …/webflowembed…-16.0.0.js                                        (Webflow embed code — injects PDF viewer script)
```

### 3.2 Webflow internals

- **Site ID:** `6305e5d42c283515c3e71b8c`
- **Homepage page ID:** `6992f7cec1f128c6bee2833c`; demo page: `6993291314630e17b03fd996`
- **CSS:** 1.79 MB shared stylesheet (Webflow's normal bloat — it compiles the whole design system per site)
- **JS:** 3 webpack files — a bootstrap (module map, 1.9 KB) + two chunks (516 KB + 3.05 MB). The 3 MB chunk is Webflow's interaction engine (ix2), shared site-wide.
- **CMS:** Webflow CMS with ~15 collections — 758 total pages:

| Collection | Count | URL pattern |
|---|---|---|
| Blog | 209 | `/blog/<slug>` (+ `/blog-category/`, `/type-of-blog/`) |
| Papers | 85 | `/papers/<slug>` (+ `/paper-category/`) |
| Glossary | 84 | `/glossary/<term>` |
| News | 80 | `/news/<slug>` (+ `/news-category/`) |
| Media coverage | 61 | `/media-coverage/<slug>` |
| Learn | 34 | `/learn/<topic>` |
| Events | 30 | `/events/<slug>` (+ `/event-category/`) |
| Newsletters | 18 | `/newsletters/<issue>` |
| Analyst coverage | 15 | `/analyst-coverage/<slug>` |
| Press releases | 10 | `/press-release/<slug>` |
| Case studies | 7 | `/case-study/<slug>` |
| Red teaming reports | 5 | `/red-teaming/<model>` |
| Roles (persona pages) | 7 | `/role/<persona>` |
| Use cases | 4 | `/use-case/<name>` |
| Industries | 3 | `/industry/<sector>` |
| Model categories | 4 | `/model-categories/<vendor>` |
| Executive bios | 3 | `/executive-bios/<name>` |
| Static pages | ~40 | `/demo`, `/pricing`-adjacent, `/about`, `/careers`, `/search`, `/thank-you*`, `/checkout`, `/order-confirmation`, `/trust-center`, `/integrations`, `/brand-assets`… |

- **Component system:** Webflow "code islands" — `<code-island data-loader="{FEDERATION…}">` with client/server module URLs pointing at `code-components.website-files.com`. Server-rendered shadow-DOM components (the logo wall is one: `LogoSection`, hydrated client-side with `data-hydrate="true"`).
- **Search:** `/search` is Webflow's native search (robots.txt disallows `*_page=` pagination params).
- **robots.txt** blocks: `/*_page=`, `/*__hstc=`, `/*__hssc=`, `/*__hsfp=` (HubSpot tracking params).

### 3.3 Design system (extracted from shared.css)

```css
/* Brand palette */
--hai-blurple:   #5049f9;   /* primary accent */
--hai-amethyst:  #ab5fce;   /* secondary accent */
--hai-cerulean:  #36b1fe;   /* tertiary */
--hai-deepblue:  #10131c;   /* dark surface (l-r--dark-blue) */
--light-grey:    #e7e8ec;
--light-purple:  #ded9f9;
--soft-purple:   #f6f5fd;
--text:          #262525;
--gartner-match: #002856;   /* for Gartner MQ screenshots */

/* Type */
--typography--heading-font: Geist, sans-serif;   /* ONE font for everything */
--typography--body-font:    Geist, sans-serif;

/* Spacing scale (px) */
4 / 8 / 12 / 16 / 24 / 32 / 40 / 48 / 64 / 96
(page margin 32px desktop, 16px mobile)

/* Layout */
max-width: 1200px content grid
```

Form app theme tokens (same brand, encoded as CSS vars):
```css
--f-accent: #5049F9;  --f-card: #FFFFFF;  --f-text: #101828;
--f-radius: 9px;      --f-card-radius: 14px;
--f-shadow: 0 12px 38px rgba(20,30,55,.06);
```
The form app supports `?theme=light|dark`, `?card=true|false`, and per-token query overrides (`accent`, `bg`, `text`, `muted`, `radius`, `font`, `layout=two-column|stacked`, `maxWidth`, `weight`) — a themable embed contract via URLSearchParams.

### 3.4 Recreation recipe (site)

```
1. Webflow project, single design system (Geist, palette above)
2. 758-page CMS: blog/papers/glossary/news/media/newsletters/events/press/case-studies/learn
   + persona (/role/), industry, use-case pages (SEO playbook: one page per keyword cluster)
3. Static pages: /demo (form), /thank-you-meeting-scheduled, /thank-you-meeting-not-scheduled,
   /thank-you, /checkout, /order-confirmation (a products/checkout flow exists — Webflow ecommerce
   or a connected checkout)
4. Cloudflare in front, HSTS preload, CSP frame-ancestors 'self'
5. HubSpot EU portal for tracking script + CRM
6. Finsweet cookie-consent banner (category-gated)
```

---

## 4. The Forms Architecture (the smart part)

Holistic AI does **not** use HubSpot forms. The demo form is an **iframe into their own app**:

```html
<!-- on /demo -->
<div data-hai-form="demo-request-ux7tu" data-hai-min-height="560">
  <iframe src="https://hai-brain.vercel.app/f/demo-request-ux7tu?embed=1"
          title="Schedule a demo with Holistic AI"
          referrerpolicy="no-referrer-when-downgrade"
          scrolling="no" style="width:100%;border:0;min-height:560px;background:transparent">
  </iframe>
</div>
```

- Form slug: `demo-request-ux7tu` (random suffix → forms are addressable, versioned)
- Embed mode: `?embed=1` adds `.embed` class; iframe posts height to parent:
  `postMessage({type:'hai-form-height', slug:"demo-request-ux7tu", height:v}, '*')`
- **Form fields** (observed): Full Name* (text), Work email* (email, validated), "What brings you here?"* (select: solution/partnership), "What are you looking for?"* (textarea, 10–200 chars, live counter), consent checkbox (required, pre-checked), submit → "Request a demo"
- **App stack:** Next.js App Router + Turbopack (chunks `turbopack-3bwhqh5l8zqc1.js`), React, Lucide icons (mail icon is literally `lucide lucide-mail`), server components with RSC flight payload (`_R_` script tag)
- **Styling:** hand-rolled `--f-*` token system, `.nf-form`/`.nf-field` classes (not Tailwind — raw CSS vars)
- **Lead API:** `POST /api/lead` — rejects without valid email: `400 {"ok":false,"error":"A valid email is required."}`
- HubSpot's `js-eu1.hs-scripts.com` script is still loaded site-wide (analytics/CRM tracking), but conversion happens via the custom app, not HubSpot forms

**Why iframe:** attribution fields ride along invisibly (see §5), the form lives in *their* app so they own the data path end-to-end, and it's embeddable anywhere (landing pages, partner sites) with theme overrides.

---

## 5. hai-track.js v2.0.0 — The Attribution Engine (full contract)

This is the most valuable artifact. It is 812 lines of heavily-commented vanilla JS. Complete behavior:

### 5.1 Configuration (data-attributes on the script tag)

```html
<script src="https://hai-brain.vercel.app/hai-track.js"
        data-hai-activity="on"          <!-- form field telemetry ON -->
        defer>
</script>
```

| Attribute | Default | Meaning |
|---|---|---|
| `data-api` | self-origin | API base (defaults to wherever the script is served from) |
| `data-consent` | off | `"required"` gates everything behind `HAITrack.grantConsent()` |
| `data-beacon` | on | `"off"` disables pageview beacons |
| `data-activity` | off | `"on"` enables pre-submit form telemetry |
| `data-hai-form` | — | explicit form name for CRM notes |
| `data-hai-min-height` | — | iframe min height |
| `?haidebug=1` | — | debug logging to console |

**Note:** on the live site, `data-consent` is NOT set → the consent gate is bypassed (tracking runs regardless of the Finsweet banner choice).

### 5.2 Storage schema (localStorage only, no cookies)

| Key | Content | Retention |
|---|---|---|
| `hai_visitor` | 32-hex random ID (crypto.getRandomValues) | permanent |
| `hai_first_touch` | first visit's full attribution | ~400 days ("B2B sales cycle") |
| `hai_last_touch` | most recent visit with a real signal | until newer signal |
| `hai_session` | `{start, last}` timestamps | 30-min inactivity window |
| `hai_counts` | `{pageviews, sessions}` | with visitor |
| `hai_consent` | boolean (only if consent mode) | — |
| `hai_queue` | offline queue | — |

Identity: 16 random bytes → hex, fallback to `Date.now()+Math.random` if crypto unavailable.

### 5.3 Channel classification (the core algorithm)

Precedence, strongest signal first:
```
1. AI assistant referrer/source  → "AI Assistant"
2. explicit utm_medium           → Paid Search / Paid Social / Display / …
3. click ID param                → platform + channel from CLICK_IDS map
4. referrer host                 → search / social / webmail→Email / referral
5. nothing                       → "Direct"
```

**12 channels:** Direct · Organic Search · Paid Search · Paid Social · Organic Social · Display · Email · Affiliate · Referral · Campaign · AI Assistant · Internal

**AI sources list (checked FIRST, before search):**
```
chatgpt.com, chat.openai.com, openai.com, perplexity.ai, claude.ai, anthropic.com,
gemini.google.com, bard.google.com, aistudio.google.com, copilot.microsoft.com,
edgeservices.bing.com, you.com, poe.com, phind.com, deepseek.com, grok.com, x.ai,
mistral.ai, meta.ai  (+ more — "revisit quarterly" per comment)
```
Comment admits: *"35–70% of AI referrals arrive with no referrer at all and are indistinguishable from Direct."*

**Click-ID map (`CLICK_IDS`):**
```
gclid/gbraid/wbraid → Google Ads, Paid Search
dclid → Google Display/YouTube, Display
msclkid → Microsoft Ads, Paid Search
fbclid → Meta, Paid Social
li_fat_id → LinkedIn Ads, Paid Social
ttclid → TikTok Ads, Paid Social
twclid → X Ads, Paid Social
rdt_cid → Reddit Ads, Paid Social
ScCid → Snapchat Ads, Paid Social
epik → Pinterest Ads, Paid Social
qclid → Quora Ads, Paid Social
tblci → Taboola, Display
dicbo → Outbrain, Display
irclickid → Impact, Affiliate
```
Unrecognized click IDs are forwarded under their real param name — the server classifies.

**Search engines:** Google, Bing, DuckDuckGo, Yahoo, Ecosia, Brave, Startpage, Baidu, Yandex, Naver, Qwant
**Social:** LinkedIn, lnkd.in, Facebook, Instagram, t.co/twitter.com/x.com, YouTube, youtu.be, Reddit, TikTok, Hacker News, Medium, Substack, Threads, Quora, Slack, Teams
**Webmail (→ Email, not Referral):** mail.google.com, outlook.live/office, mail.yahoo.com, mail.proton.me
**Self hosts (excluded from acquisition):** holisticai.com, holisticai.io, webflow.io, localhost

**utm_medium mapping:** `cpc|ppc|paid|sem|adwords`→Paid Search; `paidsocial`→Paid Social; `display|banner|cpm|programmatic|native`→Display; `social`→Organic/Paid Social (paid if click ID present).

### 5.4 The three API endpoints

**`POST /api/visit`** (pageview beacon, via `navigator.sendBeacon`):
```json
{
  "type": "pageview",           // or custom event via HAITrack.track("pricing_cta_click")
  "visitorId": "<32-hex>",
  "sessionId": "<…>",
  "isFirstTouch": true,
  "isNewSession": true,
  "consent": true,
  "channel": "Paid Search",
  "platform": "Google Ads",
  "referrer": "https://google.com/…",
  "landingPage": "https://www.holisticai.com/blog/foo?utm_source=x",
  "pageTitle": "…",              // sliced to 200 chars
  "params": { "utm_source": …, "utm_medium": …, "utm_campaign": …, "utm_term": …,
              "utm_content": …, "<click_id_param>": "<click_id>" },
  "ts": "2026-10-14T…"
}
```
*Note the deliberate path choice: `/api/visit` not `/api/track` — "generic privacy blocklists match the PATH `/api/track`, so the browser refused the beacon outright (ERR_BLOCKED_BY_CLIENT)".*

**`POST /api/form-activity`** (pre-submit telemetry — live on this site):
```json
{
  "<form fields…>": "…",
  "sessionId": "…",
  "events": [
    {"type":"focus|input|blur","field":"email","filled":true,"length":23,
     "value":"…",   // ONLY for allowlisted menu fields: intent, plan, team_size, topic
     "at": 1699999999}
  ],
  "email": "jane@company.com",   // captured once it parses as valid
  "page_path": "/demo"
}
```
Privacy design (from their comments): field name, order, filled/not, length, email — **never** free-text values of name/company/message. Server re-strips anything outside `ACTIVITY_VALUES = {intent, plan, team_size, topic}`. Flushes on: 20 events, 4s idle, tab close (sendBeacon survives unload), or explicit `HAITrack.flushActivity()`.

**`POST /api/lead`** (on form submit): validates email server-side, receives:
```json
{
  // last touch (converting visit)
  "utm_source","utm_medium","utm_campaign","utm_term","utm_content",
  "referrer","landing_page","gclid",
  // first touch (original discovery)
  "first_utm_source","first_utm_medium","first_utm_campaign","first_referrer",
  "first_landing_page","first_seen_at",
  // engagement before converting
  "pageview_count","session_count",
  // whichever click ID was seen, under its real param name
  // form identity:
  "form_name","form_id","form_page_url","page_title"
}
```

### 5.5 Mechanics worth copying

- **Hidden-field mirroring:** before submit, writes the payload into hidden `<input>`s on the form — so it also works for forms that post elsewhere (native Webflow submits, HubSpot embeds, Marketo). Uses MutationObserver for late-rendered forms (Webflow embeds, modals).
- **Shadow-DOM fix:** Webflow components render in shadow roots; `e.target` retargets to the custom-element host, so a document-level listener misses all keystrokes. Fix: `e.composedPath()[0]` gets the real target. (Documented as "the failure that made form activity look dead on the live site".)
- **sendBeacon content-type trap:** `application/json` bodies force a CORS preflight, and sendBeacon cannot preflight — it returns true (queued) while the browser silently drops it. Fix: `Blob([body], {type:"text/plain"})` — simple request, no preflight, server parses as JSON anyway.
- **SPA-safe:** patches `history.pushState/replaceState` + `popstate` to count client-side navigations as pageviews *without* re-running attribution (would register as self-referral).
- **Consent replay:** with `data-consent="required"`, the arrival visit is held in memory (`state.pending`) so granting consent later records the true source, not a self-referral from page 2.
- **First-party only:** no cookies, no fingerprinting, no third-party requests until form submit.

### 5.6 Public API (`window.HAITrack`)

```js
HAITrack.get()            // full state {first, last, counts, current}
HAITrack.fields(form)     // flat payload for /api/lead
HAITrack.channel()        // "Paid Search"
HAITrack.formName(form)   // heuristic name resolution
HAITrack.fill(form)       // inject/refresh hidden inputs
HAITrack.track("event")   // custom event beacon
HAITrack.activity()       // debug: {enabled, consented, endpoint, sessionId,
                          //          emailCaptured, queued, formName}
HAITrack.flushActivity()  // force flush
HAITrack.grantConsent()   // from cookie banner; replays held visit
HAITrack.revokeConsent()  // wipes all keys
HAITrack.version          // "2.0.0"
```

---

## 6. Third-Party Integrations (complete list)

| Service | Purpose | Load |
|---|---|---|
| Cloudflare | CDN/WAF/TLS | edge |
| Webflow | CMS + hosting + ix2 interactions | origin + CDN |
| HubSpot EU (25785988) | CRM + analytics tracking | `js-eu1.hs-scripts.com` |
| Convex | realtime DB (visits/leads/activity) | server-side |
| Vercel | Next.js form app + APIs | `hai-brain.vercel.app` |
| Finsweet fs-cc | cookie consent | jsdelivr CDN |
| Finsweet components | marquee, counters, consent-gated elements | CDN |
| Google Fonts | Geist | fonts.googleapis.com |
| jQuery 3.5.1 | Webflow dependency | CloudFront (d3e54v103j8qbb) |
| js-cookie 2.2.1 | cookie helper | cdnjs |
| Webfonts loader | font orchestration | googleapis |
| pdf.bestfreecdn.com | PDF viewer injected by Webflow embed | on demand |
| ahrefs / DMCA / Google site verification | SEO/legal verification | meta tags |

---

## 7. Complete Recreation Plan

### Phase 1 — Marketing shell
1. Webflow project: Geist type system, `--hai-*` palette, 1200px grid, spacing scale 4–96
2. CMS collections: blog, papers, glossary, news, media-coverage, learn, events, newsletters, press, case-study, red-teaming, roles, industries, use-cases, model-categories, executive-bios
3. Static pages: home, /demo, /about, /careers, /search, /thank-you×3, /checkout, /order-confirmation, /trust-center, /integrations, /privacy-policy, /terms-conditions
4. Cloudflare: proxied DNS, HSTS preload, `frame-ancestors 'self`, cache HTML 5d / assets immutable
5. Finsweet cookie banner (category consent)

### Phase 2 — Form + lead platform
1. Vercel + Next.js 15 (App Router, Turbopack): route `/f/[slug]` renders form by slug with `?embed=1` detection and postMessage height reporting
2. Form fields: name, email (validated), intent select, message textarea (10–200), consent checkbox — styled with `--f-*` tokens, themeable via query params
3. `POST /api/lead`: zod-validate email, write to Convex `leads` table, push to HubSpot (or any CRM)
4. Embed on /demo as iframe with `data-hai-form` slug

### Phase 3 — Attribution engine
1. `hai-track.js` v2.0.0-equivalent: visitor ID (localStorage), session (30-min window), first/last touch (400-day first), channel classifier (12 channels, AI-first precedence, 15 click IDs, search/social/webmail maps, self-referral exclusion)
2. Three endpoints: `/api/visit` (sendBeacon, text/plain body), `/api/form-activity` (field-level telemetry with allowlist values), `/api/lead` (validated)
3. Hidden-field mirroring + MutationObserver for late forms + shadow-DOM composedPath fix + SPA history patch
4. Convex: `visits` table (raw params, server re-classification as safety net), `leads` (first+last touch joined), `form_activity` (event stream)
5. Optional hardening (they didn't do it): set `data-consent="required"` and gate the pageview beacon on the banner, not just form activity

### Phase 4 — Analytics layer
- HubSpot receives leads with attribution fields as custom properties (first_touch_*, last_touch_*, pageview_count, session_count, channel)
- Convex powers dashboards: per-channel conversion (not just per-channel leads — that's what /api/visit buys them), AI-referral tracking, form-abandonment funnel

---

## 8. Notable Engineering Decisions (the transferable lessons)

1. **Iframe forms with a slug** — own the lead path end-to-end; embed anywhere; theme via URL
2. **`/api/visit` not `/api/track`** — privacy blocklists pattern-match on paths; naming is a real availability decision for beacons
3. **text/plain sendBeacon bodies** — application/json + sendBeacon = silent drop (preflight impossible); still parse as JSON server-side
4. **composedPath()[0]** — document-level listeners miss shadow-DOM form fields (Webflow components)
5. **AI-referral classification before search** — gemini.google.com would otherwise read as Google organic; and 35–70% of AI traffic has no referrer at all
6. **Hold the arrival visit in memory when consent is pending** — otherwise granting consent on page 2 records a self-referral
7. **First-touch 400 days** — matched to a B2B sales cycle, not a 30-day attribution window
8. **Server-side re-classification as a safety net** — client classifies for speed, server re-classifies for trust

## 9. What was NOT observable (honest gaps)

- hai-brain server code (Next.js route handlers, Convex functions) — inferred from the tracker's documented contract only; never executed
- HubSpot CRM configuration (properties, workflows, lists)
- Convex schema (table/field names beyond what the tracker writes)
- Any auth, rate limiting, or bot protection on the three APIs (empty payloads were accepted by `/api/form-activity`: `{"ok":true,"stored":0}` — no obvious validation beyond email on `/api/lead`)
- The 3 MB Webflow ix2 chunk and 13 inline HTML scripts were not fully decompiled (REA logged them as unanalyzed; 55,775 semantic unknowns remain)
