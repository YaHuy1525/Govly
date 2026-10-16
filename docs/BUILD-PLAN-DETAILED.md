# Detailed Execution Plan — "Holistic AI" Recreation

**Companion to BUILD-PLAN.md** (architecture + rationale). This document is the build manual: every task, file, command, contract, and test needed to ship.
**Effort:** 6–8 weeks solo · 3 weeks with 2 devs · each phase has a Definition of Done gate before the next starts.

---

# PART A — Bootstrap & Environment

## A1. Monorepo creation (Day 0, ~2h)

```bash
mkdir holisticai-clone && cd holisticai-clone
pnpm init
pnpm add -D turbo typescript @types/node prettier eslint vitest

# workspaces
cat > pnpm-workspace.yaml <<'EOF'
packages:
  - "apps/*"
  - "packages/*"
EOF

cat > turbo.json <<'EOF'
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**"] },
    "dev": { "cache": false, "persistent": true },
    "lint": {},
    "typecheck": { "dependsOn": ["^build"] },
    "test": { "dependsOn": ["^build"] }
  }
}
EOF

mkdir -p apps/web apps/hai-brain apps/cms packages/attribution packages/ui infra .github/workflows
```

## A2. Environment variables (complete)

```bash
# apps/web/.env.local
NEXT_PUBLIC_SITE_URL=https://www.yourdomain.com
PAYLOAD_SECRET=<openssl rand -hex 32>
DATABASE_URI=postgresql://user:pass@localhost:5432/holisticai   # Payload+Postgres
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3001
NEXT_PUBLIC_TRACKER_URL=https://hai-brain.yourdomain.com/hai-track.js

# apps/hai-brain/.env.local
NEXT_PUBLIC_CONVEX_URL=https://<deployment>.convex.cloud
CONVEX_DEPLOY_KEY=<from convex dashboard>
HUBSPOT_ACCESS_TOKEN=pat-na1-xxxxxxxx
HUBSPOT_PORTAL_REGION=eu1
UPSTASH_REDIS_REST_URL=https://<db>.upstash.io
UPSTASH_REDIS_REST_TOKEN=<token>
FORMS_ADMIN_TOKEN=<openssl rand -hex 24>   # protects form CRUD

# apps/cms/.env.local
DATABASE_URI=postgresql://user:pass@localhost:5432/holisticai
PAYLOAD_SECRET=<same as web if shared DB>
```

## A3. Shared configs (Day 0, ~1h)

```jsonc
// packages/tsconfig/base.json
{
  "compilerOptions": {
    "strict": true, "noUncheckedIndexedAccess": true, "noImplicitOverride": true,
    "target": "ES2022", "module": "ESNext", "moduleResolution": "bundler",
    "jsx": "react-jsx", "skipLibCheck": true, "esModuleInterop": true,
    "resolveJsonModule": true, "isolatedModules": true, "verbatimModuleSyntax": true
  }
}
```

**Day-0 gate:** `pnpm install` clean; `pnpm turbo run typecheck` green on empty packages.

---

# PART B — Day-by-Day Task Breakdown

Each day lists: goal, files created, commands, test, gate.

## Phase 0 — Foundations (Days 1–4)

### Day 1 — Packages & CI
| Task | Detail |
|---|---|
| Create `packages/attribution` | `package.json` (name `@hai/attribution`, exports `./classify`, `./tables`), `src/tables.ts` (copy §5.1 tables verbatim from BUILD-PLAN), `src/classify.ts`, `src/index.ts` |
| Create `packages/ui` | `tokens.css` (full `--hai-*` + `--f-*` token sets), `src/index.ts` |
| CI workflow | `.github/workflows/ci.yml`: pnpm install → typecheck → lint → vitest on PR |

**Test:** classifier unit tests already written on Day 1 (TDD — see Part F).
**Gate:** `pnpm test` green; tables byte-compared against original regexes.

### Day 2 — Convex & DB
| Task | Detail |
|---|---|
| `npx convex dev` in hai-brain | generates `convex/_generated/` |
| Deploy schema | `convex/schema.ts` per BUILD-PLAN §2 (visits/leads/formActivity/forms, all indexes) |
| Mutations/queries | `visits.record`, `leads.create`, `formActivity.record`, `forms.bySlug`, analytics queries (stubbed) |
| `attribution.ts` server fn | imports `@hai/attribution` classify; re-classifies raw params |

```bash
cd apps/hai-brain && npx convex dev --once   # first deploy
```

**Test:** Convex function unit tests via `convex-test` (record visit → query by_visitor returns it).
**Gate:** schema live in dev; `npx convex dashboard` shows 4 tables.

### Day 3 — Payload CMS base
| Task | Detail |
|---|---|
| `apps/cms` init | Payload 3 + Postgres adapter, admin at `/admin` |
| Core collections | `Media.ts` (uploads, sizes: thumb/card/hero/og), `Pages.ts` (flexible blocks), `Users.ts` (auth) |
| Taxonomy collections | `BlogCategories`, `NewsCategories`, `EventCategories`, `PaperCategories`, `TypeOfBlog`, `Roles`, `Industries`, `UseCases`, `ModelCategories` |

```bash
cd apps/cms && pnpm add payload @payloadcms/db-postgres @payloadcms/richtext-lexical
pnpm payload generate:types && pnpm payload migrate:create
```

**Gate:** `/admin` loads; Media + Pages + all 9 taxonomies visible; `pnpm payload migrate` applies clean.

### Day 4 — Web app skeleton + Vercel
| Task | Detail |
|---|---|
| `apps/web` init | Next.js 15 (App Router, TS strict, src dir), Tailwind NOT used — raw CSS + tokens |
| Root layout | `next/font/google` Geist (weights 100–900), global CSS imports tokens, metadata defaults, `lang="en"` |
| Payload client | `lib/payload.ts` — Local API (same process) or REST (if CMS deployed separately) |
| Vercel projects | `web` + `hai-brain`; connect repo; preview deploys on |
| Scripts | `dev` (3000), `build`, `start`; hai-brain dev on 3001 |

**Gate:** both apps build & deploy to Vercel preview; Convex dev connected.

---

## Phase 1 — CMS content model (Days 5–9)

### Day 5 — Content collections (part 1)
| Collection | Fields |
|---|---|
| `Blog` | title, slug, excerpt(200), cover(Media), body(lexical), authors(→Users), categories(→BlogCategories), typeOfBlog(→TypeOfBlog), seo{title,description,ogImage}, publishedAt, featured(bool), readingTime(number) |
| `News` | title, slug, excerpt, cover, body, categories(→NewsCategories), source(string), publishedAt, seo |
| `Glossary` | term(title), slug, definition(richText, short), body(long), related(→Glossary many), category, seo |

### Day 6 — Content collections (part 2)
| Collection | Fields |
|---|---|
| `MediaCoverage` | title, slug, outlet(string), url, summary, publishedAt, logo(Media), seo |
| `Papers` | title, slug, abstract, authors[], pdf(Media), cover, categories(→PaperCategories), publishedAt, seo |
| `Learn` | title, slug, body, category, related(→Learn), seo |
| `Events` | title, slug, description, date, endDate, location, type(→EventCategories), registrationUrl, cover, seo |

### Day 7 — Content collections (part 3) + Forms
| Collection | Fields |
|---|---|
| `Newsletters` | title, slug, issue(number), month, year, pdf(Media), cover, seo |
| `AnalystCoverage` | title, slug, firm, report, url, quote, logo, publishedAt |
| `PressRelease` | title, slug, dateline, body, contact, seo |
| `CaseStudy` | title, slug, client, industry, challenge, solution, results[], logo, cover, seo |
| `RedTeaming` | title, slug, model, vendor, findings, report(Media), publishedAt, seo |
| `ExecutiveBios` | name, slug, role, bio, photo, linkedin, twitter |
| `Forms` | slug(unique), title, fields(json), theme(json), minHeight(number), active(bool) — **mirrors Convex forms table** |

### Day 8 — Seed data pipeline
```bash
# scripts/seed/ — structure from the 758-URL sitemap (already extracted)
node scripts/seed/collections.mjs      # creates collection docs from URL map
node scripts/seed/taxonomies.mjs       # category docs
# content bodies: scrape public pages (respect robots.txt, 1 req/s) OR placeholder markdown
```
- Every collection gets `beforeChange` hook: auto-slug from title, auto `publishedAt`, auto SEO defaults (title = page title, description = excerpt)
- Access control: read public; create/update admin-only

**Gate:** one doc per collection seeded; blog post + glossary term + event render-ready.

### Day 9 — Draft/preview + validation
- `versions: { drafts: true }` on all content collections
- Preview route `/api/preview?secret=...&slug=...&collection=...` → sets preview cookie
- Field validation: slug unique per collection, `publishedAt` required on publish, cover required on Blog/News
- Relation integrity: beforeDelete hooks block deleting a category with members (or reassign)

**Gate:** draft → preview → publish cycle works; deleting used category is blocked.

---

## Phase 2 — Marketing shell (Days 10–14)

### Day 10 — Layout & navigation
Files: `app/layout.tsx`, `app/(marketing)/layout.tsx`, `components/Nav.tsx`, `components/Footer.tsx`, `components/Container.tsx`
- Header: logo, mega-menu (Products: Identify/Protect/Enforce/Guardian Agents/AI Inventory…; Resources: Blog/Learn/Glossary/Papers/Events; Company: About/Careers/Trust; CTA "Book a demo")
- Footer: 4-column link grid (mirrors original sitemap clusters), legal row, newsletter signup (feeds /api/lead with `form_name: "newsletter"`)
- `Container`: max-width 1200px, padding 32px (16px mobile)
- Skip-link + focus-visible styles (a11y parity)

### Day 11 — Home page
Sections (from observed HTML):
1. Hero: "Govern AI across your enterprise." + sub + dual CTA + product screenshot placeholder
2. Trust bar: "Trusted by enterprises…" + Gartner Challenger badge pill
3. Problem band: "AI is shipping faster than you can govern it" + 4 stat cards (63% IBM 2025 · €35M EU AI Act Art.99 · +$670K IBM breach · 8–16 weeks HAI data) with citation footnotes
4. Governed/Shadow-AI comparison (3-column: Governed vs Known-untested vs Shadow AI)
5. Solution: "Govern every AI system automatically…" + integrations grid (AWS/Azure/GitHub/Databricks + "20+ integrations")
6. Inventory demo: animated inventory card (128 systems, +3 discovered, rows: Claims triage agent/High/Operations…) — client component, counts animate
7. Risk management section + red teaming
8. LogoWall (16 customer logos — SSR island, §D5)
9. CTA band

### Day 12 — Static pages (part 1)
`app/(marketing)/`: about, why-holisticai, careers, trust-center, integrations, brand-assets, privacy-policy, terms-conditions, hai-lab, ai-tracker, guardian-agents
- Each uses `Pages` collection blocks (hero, richtext, CTA, faq, stats, logos, embed)
- Legal pages: same structure, static content

### Day 13 — Static pages (part 2) + product cluster
- Product cluster: identify, protect, enforce, ai-governance-platform, ai-asset-discovery, ai-inventory, ai-risk-management, ai-system-testing, ai-red-teaming, ai-audits, ai-safeguard, regulatory-alignment, operational-alignment (13 pages, shared template with per-page content blocks)
- thank-you, thank-you-meeting-scheduled, thank-you-meeting-not-scheduled, checkout, order-confirmation (flow pages; checkout = simple form → /api/lead with `form_name: "checkout"`)
- 404 + 500 pages

### Day 14 — Search, sitemap, robots
- `/search`: query Convex/Payload search index → results grouped by collection → paginated (`?page=`)
- `app/sitemap.ts`: iterate all collections → 758 URLs + collection index pages; `alternates` per locale if added
- `app/robots.ts`: allow all; disallow `/api/*`, `/_next/*`, `/search?*`, plus original's HubSpot params (`*__hstc=`, `*__hssc=`, `*__hsfp=`)
- JSON-LD: Organization (sameAs: social), WebSite (potentialAction SearchAction), BreadcrumbList on collection pages

**Gate:** Lighthouse ≥ 95 perf/SEO on home; sitemap.xml URL count matches original (758); robots.txt disallow list present.

---

## Phase 3 — Collection pages (Days 15–19)

### Day 15 — Generic collection template
```tsx
// app/[collection]/[slug]/page.tsx — route map
const COLLECTIONS: Record<string, {get, template}> = {
  blog: { get: (s) => getBlog(s), template: ArticleTemplate },
  papers: ..., glossary: ..., news: ..., "media-coverage": ..., learn: ...,
  events: ..., newsletters: ..., "analyst-coverage": ..., "press-release": ...,
  "case-study": ..., "red-teaming": ..., "executive-bios": ...,
  role: ..., industry: ..., "use-case": ..., "model-categories": ...,
};
```
- `generateStaticParams` per collection (top 100); `revalidate: 3600` ISR
- 404 on missing slug; `notFound()` + `generateMetadata` (title/description/og/canonical)
- ArticleTemplate: breadcrumb, hero (title + meta + cover), body (lexical renderer), author box, related (3 by category), share row, TOC sidebar (from h2s)

### Day 16 — Category & archive pages
- `/[collection]/category/[slug]` + `/[collection]/page/[n]` (or `?page=n` per original robots disallow of `*_page=` — match: use `?page=`)
- Archive template: filter chips (categories), sort (newest/featured), grid of cards, pagination
- Taxonomies: blog-category, type-of-blog, news-category, event-category, paper-category

### Day 17 — Persona/industry/use-case templates
- Same shell as archive; content blocks from `Pages`-style fields stored on the doc
- Internal linking: every article links 2–3 related glossary terms (SEO playbook)

### Day 18 — Static params & revalidation
- `generateStaticParams` for all collections; build-time prerender top pages
- On-demand ISR: Payload `afterChange` hook → `revalidatePath('/blog')`, `revalidateTag('blog-'+slug)`
- Vercel: `revalidate` env respected; build cache warm

### Day 19 — Content rendering & media
- Lexical renderer: headings (anchors), paragraphs, lists, links, images (with `sizes`), quotes, code, embeds, tables
- Media: `next/image` with Webflow CDN pattern replaced by Vercel Blob/local `public/`; responsive `srcset`
- Reading time auto-calc (200 wpm) on save hook

**Gate:** every collection renders with seeded content; category pages paginate; ISR revalidation works on publish.

---

## Phase 4 — hai-brain form app (Days 20–24)

### Day 20 — `/f/[slug]` route + form renderer
Files: `app/f/[slug]/page.tsx`, `app/f/[slug]/FormClient.tsx`, `components/form/*`
- Server: load form config from Convex `forms.bySlug` (fallback: hardcoded `demo-request` config for resilience)
- Renderer from config: text, email, select, textarea, checkbox(consent) — with per-field validation
- Exact fields (observed): Full Name* (placeholder "Jane"), Work email* (placeholder "jane@company.com"), "What brings you here?"* (select: "A solution for my company" / "A partnership"), "What are you looking for?"* (textarea 10–200, placeholder + live `nf-count` counter), consent checkbox (required, checked, links privacy-policy)
- `nf-form`/`nf-field`/`nf-consent`/`nf-count`/`nf-contact` classes + `--f-*` tokens

### Day 21 — Embed protocol
- `embed=1` (or `window.self !== window.top`) → `document.body.classList.add('embed')`
- ResizeObserver → `postMessage({type:'hai-form-height', slug, height}, '*')` (debounced 100ms)
- Parent contract: iframe `scrolling="no"`, `min-height` from `data-hai-min-height`
- `referrerpolicy="no-referrer-when-downgrade"` on parent iframe
- Success state: replace form with confirmation (no navigation — keeps embed tidy)

### Day 22 — Theme system
- Query params: `theme=light|dark`, `card=true|false`, `accent`, `bg`, `pageBg`, `text`, `muted`, `label`, `border`, `inputBg`, `radius`, `font`, `layout=two-column|stacked`, `cardBorder`, `titleSize`, `buttonRadius`, `weight`, `maxWidth`, `link`
- Validators (from original): color regex `^(#[0-9a-f]{3,8}|(rgb|hsl)a?\([0-9 .,%/deg]+\)|[a-z]{3,20})$`, num `^\d{1,3}(\.\d+)?$`, weight `^[1-9]00$`, radius/button-radius `^\d{1,3}(\.\d+)?$`, maxWidth `^\d{2,4}$` or "none", font `^[a-z0-9 ,'"-]{1,80}$`
- Runtime API: `window.__haiApplyTheme({theme, accent, …})`
- Light/dark preset objects (exact values in RECREATION-SPEC §3.3)

### Day 23 — Client validation + submit
- zod schema (mirror server §5.3); inline errors per field; submit disabled until valid
- Submit → `POST /api/lead` with `{email, name, intent, message, ...HAITrack.fields(form)}` (tracker fills hidden fields pre-submit; FormClient also merges `HAITrack.fields()` directly when tracker present)
- States: idle → submitting (button spinner) → success (confirmation card) → error (inline + retry)
- Network failure: queue in `hai_queue`, retry on next load (port tracker's queue behavior)

### Day 24 — Forms admin + demo page integration
- `POST /api/forms` (admin-token protected): CRUD form configs; slug generation `demo-request-<8 random chars>`
- Web `/demo` page: embed block exactly as §5.5 with slug from CMS/env; preconnect to hai-brain origin
- Local E2E: page loads iframe, form submits, lead row appears in Convex

**Gate:** form embeds on /demo, theme params apply, submit creates lead with attribution fields.

---

## Phase 5 — Attribution engine (Days 25–31) ← critical path

### Day 25 — Classifier completion + tests
- Finish `packages/attribution` per BUILD-PLAN §5.1–5.2 (tables + classify + helpers `hostOf/lookup/isSelf`)
- Full test suite (Part F): 12 channels × edge cases (gemini→AI not Search, webmail→Email, self→excluded, click-id beats referrer, utm_medium beats click-id, AI beats everything)
- `pnpm test` 100% coverage on classify.ts

### Day 26 — Tracker port: identity + storage
Port `hai-track.js` sections 1–4 to `apps/hai-brain/public/hai-track.js` (keep as IIFE, ES5-safe — it runs everywhere):
- Config from `dataset`: api, consent, beacon, activity, debug (`?haidebug=1`)
- Storage layer: read/write/remove wrapped in try-catch (never throws)
- `visitorId()`: `crypto.getRandomValues(16)` → hex; fallback `Date.now()+Math.random`
- Constants: SESSION_MINUTES=30, FIRST_TOUCH_DAYS=400
- Storage keys: `hai_visitor`, `hai_first_touch`, `hai_last_touch`, `hai_session`, `hai_counts`, `hai_consent`, `hai_queue`

### Day 27 — Tracker port: capture + session + attribution
- `currentVisit()`: capture {utm_*, referrer, landing_page, click_id(_param), ts} from `location` + `document.referrer`
- Session: `hai_session` {start, last}; new session if `now - last > 30min`; counts: pageviews/sessions in `hai_counts`
- Attribution state: first-touch = first visit ever with a signal; last-touch = most recent visit with a signal (never overwritten by self-referrals or signal-less Directs)
- `hasSignal(v)`: any utm_*, click_id, or non-self referrer
- 400-day first-touch expiry check

### Day 28 — Tracker port: beacon + form activity
- `beacon(extra)`: build payload (§5.4 contract), `sendBeacon(API + "/api/visit", new Blob([body], {type: "text/plain"}))`; fetch fallback `keepalive: true`; **never throw**
- `watchFormActivity()` (gated on `data-activity="on"` + consent):
  - document-level focus/input/blur listeners → `realTarget(e)` = `e.composedPath()[0]` (**shadow-DOM fix**)
  - event: `{type, field: fieldNameOf(el), filled: val.length>0, length, value (only if ACTIVITY_VALUES[field]), at: Date.now()}`
  - `ACTIVITY_VALUES = {intent:1, plan:1, team_size:1, topic:1}`; email captured when `EMAIL_OK.test(val)`
  - queue flush: 20 events OR 4s idle OR `pagehide`/`beforeunload` OR `HAITrack.flushActivity()`
  - `harvestEmail` on flush; payload per §5.4 form-activity contract

### Day 29 — Tracker port: hidden fields + SPA + consent
- `fillHiddenFields(form)`: map payload → hidden inputs (create if missing; only set if hidden or empty)
- MutationObserver on documentElement (childList+subtree): late forms (Webflow embeds, modals) get filled
- SPA: patch `history.pushState/replaceState` + `popstate` → `onRouteChange()` → count pageview + beacon, **never** re-run attribution
- Consent: `data-consent="required"` → `init()` holds `state.pending = currentVisit()` and returns; `grantConsent()` writes `hai_consent=true`, replays pending into first/last, re-inits
- `revokeConsent()`: remove all 7 keys, reset state

### Day 30 — Tracker port: public API + APIs
- `window.HAITrack = {get, fields, channel, formName, fill, track, activity, flushActivity, grantConsent, revokeConsent, version: "2.0.0"}`
- `formName(form)`: explicit `data-hai-form`/`data-name` → aria-label → submit button text → nearest heading (4 hops) → id/name → "Website form" (slice 120)
- Implement 3 routes: `/api/lead` (zod email → Convex → HubSpot), `/api/visit` (Convex + server re-classify), `/api/form-activity` (Convex + server-side allowlist re-strip)
- Rate limiting: Upstash sliding window 60/min per IP on all 3 (original had none — add)

### Day 31 — HubSpot sync + integration test
- `syncHubSpot(lead)`: `POST https://api.hubapi.com/crm/v3/objects/contacts` upsert by email; properties: firstname/lastname split, `first_touch_utm_source`, `first_touch_channel`, `last_touch_channel`, `last_touch_platform`, `pageview_count`, `session_count`, `form_name`, `landing_page`, `hs_lead_status`; retry ×3 with backoff; failures to dead-letter log (never block the lead response)
- Playwright E2E: land with `?utm_source=test&utm_medium=cpc&gclid=abc` → fill demo form → submit → assert Convex lead row has channel "Paid Search", platform "Google Ads", gclid "abc", first==last touch, pageview_count≥1 → assert HubSpot contact updated (mock or real EU portal test)

**Gate:** E2E green; classifier 100% coverage; tracker byte-behavior parity checklist (§8 of BUILD-PLAN) passes.

---

## Phase 6 — Integrations (Days 32–35)

### Day 32 — Consent banner
- Banner + preferences modal (categories: necessary(always on), analytics, marketing); Finsweet-equivalent API: `window.fsCc = {consents, grant, revoke, on('consentsUpdated')}`
- On analytics accept → `HAITrack.grantConsent()`; on revoke → `HAITrack.revokeConsent()`
- Banner copy + links (privacy-policy); store consent in `fs-cc-consent` cookie (maxAge 180d per original)
- **Decision (flagged earlier): default = gated (`data-consent="required"`)**

### Day 33 — HubSpot tracking + lead sync hardening
- Tracking script EU region (portal id from env) on web app
- Lead sync: dedupe by email; merge attribution properties (don't overwrite first-touch once set — read existing contact first)
- Webhook-style backup: also POST to a `leads-webhook` URL for Zapier/n8n (optional)

### Day 34 — Thank-you flow + checkout
- `/api/lead` response carries `redirect` (thank-you variant by `form_id`/intent); form client navigates (embed mode: parent redirect via postMessage `{type:'hai-navigate', url}`)
- thank-you-meeting-scheduled / not-scheduled variants (calendar embed on scheduled)
- checkout + order-confirmation: simple Stripe Checkout session OR form-only (match original's minimal flow)

### Day 35 — Cross-app polish
- Web layout script order matches §3.1 (tracker last, defer)
- preconnect hints: hai-brain origin, fonts, CDN
- Tracker loaded on ALL web pages (site-wide tag)
- Newsletter signup in footer → /api/lead with `form_name: "newsletter"`, `intent: "newsletter"`

**Gate:** full journey: ad click (gclid) → blog → glossary → demo → submit → HubSpot contact with first+last touch; consent banner gates everything until accept.

---

## Phase 7 — Infrastructure (Days 36–38)

### Day 36 — Cloudflare
```
Rules (cf):
1. Cache: HTML → s-maxage=432000 (5d), stale-while-revalidate; assets (_next/static, images) → immutable 1y
2. Headers (Response Header Rules):
   Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
   Content-Security-Policy: frame-ancestors 'self'
   X-Frame-Options: SAMEORIGIN
   Referrer-Policy: strict-origin-when-cross-origin
   X-Content-Type-Options: nosniff
3. Bot Fight Mode: on; rate limiting on /api/* 60/min/IP
4. SSL: Full (strict); TLS 1.2+; Always HTTPS; HSTS preload eligible
5. DNS: proxied both domains (www + hai-brain)
```

### Day 37 — Vercel + envs
- Two projects (web, hai-brain), production + preview envs
- Domains: www.yourdomain.com → web; hai-brain.yourdomain.com → hai-brain
- Edge config / env sync; Convex production deploy key
- Build cache; `output: 'standalone'` not needed (Vercel native)

### Day 38 — Observability
- Vercel Log Drains → (optional) Axiom/Better Stack
- Uptime: check `/api/visit` OPTIONS + `/` 200, 1-min interval
- Alerts: lead insert errors, HubSpot sync failures, Convex function errors
- Dashboard (Phase 8) queries validated against prod-like data

**Gate:** headers byte-match original; k6/artillery 100 rps on /api/visit passes with rate limiter.

---

## Phase 8 — Analytics (Days 39–41)

### Day 39 — Convex analytics queries
```ts
// convex/analytics.ts
export const channelConversion = query({...})   // visits→leads per channel, %
export const aiReferrals = query({...})         // channel=="AI Assistant" over time, by platform
export const firstVsLast = query({...})         // attribution shift matrix
export const abandonmentFunnel = query({...})   // formActivity: started→filled→submitted
export const topLandingPages = query({...})
```
- Materialize via scheduled `crons` (Convex crons: hourly rollups into `dailyStats` table) for dashboard speed

### Day 40 — Internal dashboard
- Next.js page in hai-brain (admin-token gated): date range, channel table (visits/leads/conv%), AI-referral trend chart (Recharts), abandonment funnel, recent leads table with attribution columns
- CSV export per channel

### Day 41 — Parity metrics
- Compare clone metrics vs expectations: gated consent will show fewer visits than original's ungated tracking — document the delta

**Gate:** "Paid Search: N visits → M leads, X%" renders from real data.

---

## Phase 9 — Hardening & parity (Days 42–44)

### Day 42 — Test suites
- Vitest: classifier (done Day 25) + payload builders + zod schemas (invalid email, missing fields, oversized textarea)
- Playwright: (1) embed form resize messages; (2) shadow-DOM form fill (mount a web-component-wrapped form); (3) consent flow (reject → no beacons → accept → beacon fires with true source); (4) SPA nav counting without re-attribution; (5) sendBeacon blocked (simulate ERR_BLOCKED_BY_CLIENT via route block) → still no crash, fetch fallback

### Day 43 — Security & perf
- All inputs zod-validated server-side; textarea max 200; email regex; select values allowlisted
- CORS on hai-brain: `Access-Control-Allow-Origin` = web origin only (original: `*` — tighten)
- CSP on web: script-src self + hai-brain origin + fonts + hubspot; img-src data: https:; connect-src convex + hai-brain + hubspot
- Perf budget: home LCP < 2.5s, CLS < 0.1, form iframe TTFB < 150ms; bundle: web < 200KB first-load JS

### Day 44 — Parity checklist + launch
Run BUILD-PLAN §8 checklist end-to-end; fix gaps; production deploy; DNS cutover; post-launch 24h monitoring.

**Final gate:** all checklist items ✅; prod smoke: full lead journey on production domain.

---

# PART C — Data Contracts (canonical)

## C1. POST /api/visit
Request (sendBeacon body, JSON):
```json
{
  "type": "pageview",
  "visitorId": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6",
  "sessionId": "s-1699999999999-ab12",
  "isFirstTouch": true,
  "isNewSession": true,
  "consent": true,
  "channel": "Paid Search",
  "platform": "Google Ads",
  "referrer": "https://www.google.com/",
  "landingPage": "https://www.yourdomain.com/blog/x?utm_source=google&utm_medium=cpc&gclid=abc123",
  "pageTitle": "Blog post title",
  "params": {
    "utm_source": "google", "utm_medium": "cpc", "utm_campaign": "spring",
    "utm_term": null, "utm_content": null, "gclid": "abc123"
  },
  "ts": "2026-10-14T12:00:00.000Z"
}
```
Response: `200 {"ok":true}` · `429` rate-limited · `400` malformed (still 200 tolerated — fire-and-forget).
Server adds: `serverChannel` (re-classified), `createdAt`.

## C2. POST /api/form-activity
```json
{
  "name": "Jane", "email": "jane@company.com",
  "intent": "A solution for my company",
  "sessionId": "s-1699999999999-ab12",
  "events": [
    {"type":"focus","field":"email","filled":false,"length":0,"at":1699999999000},
    {"type":"input","field":"email","filled":true,"length":17,"at":1699999999500},
    {"type":"blur","field":"email","filled":true,"length":17,"at":1699999999900}
  ],
  "email": "jane@company.com",
  "page_path": "/demo",
  "form_name": "demo-request-ux7tu"
}
```
Rules: values only for `intent|plan|team_size|topic`; server re-strips others; flush on 20 events / 4s idle / unload.

## C3. POST /api/lead
```json
{
  "email": "jane@company.com",
  "name": "Jane Doe",
  "intent": "A solution for my company",
  "message": "Shadow AI discovery, red teaming…",
  "utm_source": "google", "utm_medium": "cpc", "utm_campaign": "spring",
  "utm_term": null, "utm_content": null,
  "referrer": "https://www.google.com/",
  "landing_page": "https://www.yourdomain.com/blog/x",
  "gclid": "abc123",
  "first_utm_source": "google", "first_utm_medium": "cpc",
  "first_utm_campaign": "spring", "first_referrer": "https://www.google.com/",
  "first_landing_page": "https://www.yourdomain.com/blog/x",
  "first_seen_at": "2026-10-01T09:00:00.000Z",
  "pageview_count": 7, "session_count": 3,
  "form_name": "demo-request-ux7tu", "form_id": "demo-request-ux7tu",
  "form_page_url": "https://www.yourdomain.com/demo",
  "page_title": "Schedule a demo"
}
```
Responses: `200 {"ok":true}` · `400 {"ok":false,"error":"A valid email is required."}` · `429`.

## C4. localStorage keys (byte-identical)
`hai_visitor` (32-hex string) · `hai_first_touch` (visit JSON) · `hai_last_touch` (visit JSON) · `hai_session` ({start,last} ms) · `hai_counts` ({pageviews,sessions}) · `hai_consent` (bool) · `hai_queue` (array of unsent payloads).

## C5. Embed protocol
Parent: `<div data-hai-form="<slug>" data-hai-min-height="560"><iframe src="https://hai-brain.<domain>/f/<slug>?embed=1" …scrolling="no" style="min-height:560px"></iframe></div>`
Child → parent messages: `{type:"hai-form-height", slug, height}` (on resize) · `{type:"hai-navigate", url}` (post-submit redirect in embed mode).
Parent → child: `{type:"hai-theme", ...tokens}` (optional runtime theming via `window.__haiApplyTheme`).

---

# PART D — Component & Asset Specs

## D1. Design tokens (complete)
```css
:root{
  --hai-blurple:#5049f9; --hai-amethyst:#ab5fce; --hai-cerulean:#36b1fe;
  --hai-deepblue:#10131c; --light-grey:#e7e8ec; --light-purple:#ded9f9;
  --soft-purple:#f6f5fd; --text:#262525; --white:#fff;
  --space-1:4px; --space-2:8px; --space-3:12px; --space-4:16px; --space-6:24px;
  --space-8:32px; --space-10:40px; --space-12:48px; --space-16:64px; --space-24:96px;
  --page-margin:32px; --content-max:1200px;
  --radius-s:9px; --radius-m:14px;
  --font-sans:"Geist",system-ui,-apple-system,sans-serif;
  --shadow-card:0 12px 38px rgba(20,30,55,.06);
}
@media(max-width:767px){:root{--page-margin:16px}}
```

## D2. Component inventory
| Component | Props | Notes |
|---|---|---|
| Container | maxWidth?, padding? | 1200px default |
| Button | variant: primary/secondary/ghost, size, href?, onClick | blurple primary |
| Section | bg?, padding: t/b from scale, children | alternating white/soft-purple |
| Card | padding, shadow?, border? | radius 14px |
| StatCard | value, label, source | home stats band |
| LogoWall | logos[{src,alt}], height=19, maxWidth=130, opacity=85, gap=56/34 | SSR + client hydration, Geist label line |
| Badge | variant: gartner/challenger | pill |
| Accordion | items[{q,a}] | details/summary, a11y |
| Marquee | items[], speed | CSS animation, respects prefers-reduced-motion |
| Counter | value, duration | count-up on intersect |
| Nav | items[] | mega-menu, mobile drawer |
| Footer | columns[] | 4-col + legal |
| Breadcrumbs | items[{label,href}] | JSON-LD BreadcrumbList |
| ArticleBody | content(lexical) | renderer with anchors |
| ConsentBanner | categories[] | fs-cc-compatible API |
| FormEmbed | slug, minHeight | iframe wrapper |

## D3. LogoWall island (federated SSR pattern)
Original: `<code-island data-loader="{FEDERATION, clientModuleUrl, moduleId, submoduleId: LogoSection}">` with shadow-DOM template + `data-hydrate="true"`. Clone: React Server Component that renders markup + a small client script for the fade-in animation (CSS `@keyframes fadeInUp`, 0.8s). Same visual: label line + text ("Trusted by the world's most innovative companies", 11px, 450 weight, 0.15em tracking, uppercase, #5049f9) + 2 rows of 8 logos.

## D4. Typography scale
Geist 100–900. Sizes: hero 56/64 desktop · h1 40/48 · h2 32/40 · h3 24/32 · body 16/24 (1.5) · small 14/20 · label 11 uppercase tracking .15em.

---

# PART E — CI/CD & Deployment Runbook

## E1. CI workflow
```yaml
# .github/workflows/ci.yml
name: CI
on: [pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup-v2@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo run typecheck lint test --filter=...[${{ github.base_ref }}]
```

## E2. Deploy
```bash
# Convex (hai-brain)
cd apps/hai-brain && npx convex deploy --cmd 'pnpm build'

# Vercel (both apps) — via git push + Vercel GitHub integration
git push origin main   # preview on PR, prod on main

# Payload migrations
cd apps/cms && pnpm payload migrate
```

## E3. Production smoke (post-deploy)
```bash
curl -sI https://www.<domain>/            # expect CF + HSTS + CSP headers
curl -s https://www.<domain>/sitemap.xml | grep -c '<loc>'   # expect 758
curl -s -X POST https://hai-brain.<domain>/api/lead \
  -H 'Content-Type: application/json' -d '{"email":"x@y.co"}' # expect 200 or 400 (no email=400)
curl -s https://hai-brain.<domain>/hai-track.js | head -1    # expect the tracker header comment
```

---

# PART F — Test Suites (real code)

## F1. Classifier (packages/attribution/src/classify.test.ts)
```ts
import { describe, it, expect } from "vitest";
import { classify } from "./classify";

describe("classify — precedence", () => {
  it("AI referrer beats search engine (gemini)", () => {
    expect(classify({ referrer: "https://gemini.google.com/" }).channel).toBe("AI Assistant");
  });
  it("AI via utm_source", () => {
    expect(classify({ utm_source: "chatgpt.com" }).channel).toBe("AI Assistant");
  });
  it("explicit utm_medium=cpc", () => {
    expect(classify({ utm_medium: "cpc", utm_source: "google" }))
      .toEqual({ channel: "Paid Search", platform: "google" });
  });
  it("click ID beats referrer", () => {
    expect(classify({ click_id_param: "gclid", click_id: "abc", referrer: "https://google.com/" }))
      .toEqual({ channel: "Paid Search", platform: "Google Ads" });
  });
  it("webmail referrer → Email not Referral", () => {
    expect(classify({ referrer: "https://mail.google.com/" }).channel).toBe("Email");
  });
  it("self referrer excluded → Direct", () => {
    expect(classify({ referrer: "https://www.holisticai.com/other" }).channel).toBe("Direct");
  });
  it("organic search", () => {
    expect(classify({ referrer: "https://duckduckgo.com/?q=x" }))
      .toEqual({ channel: "Organic Search", platform: "DuckDuckGo" });
  });
  it("organic social", () => {
    expect(classify({ referrer: "https://www.linkedin.com/" }).channel).toBe("Organic Social");
  });
  it("unknown referrer → Referral with host", () => {
    expect(classify({ referrer: "https://news.ycombinator.com/" }).channel).toBe("Organic Social");
    expect(classify({ referrer: "https://some-random-blog.com/" }).channel).toBe("Referral");
  });
  it("Direct with nothing", () => {
    expect(classify({})).toEqual({ channel: "Direct", platform: null });
  });
  it("paid social via utm_medium=paidsocial", () => {
    expect(classify({ utm_medium: "paidsocial", utm_source: "meta" }).channel).toBe("Paid Social");
  });
  it("social + click id → Paid Social", () => {
    expect(classify({ utm_medium: "social", click_id_param: "fbclid", click_id: "x" }).channel)
      .toBe("Paid Social");
  });
  it("all 15 click IDs map", () => {
    for (const p of ["gclid","gbraid","wbraid","dclid","msclkid","fbclid","li_fat_id",
                     "ttclid","twclid","rdt_cid","ScCid","epik","qclid","tblci","dicbo","irclickid"]) {
      expect(classify({ click_id_param: p, click_id: "v" }).channel).toBeTruthy();
    }
  });
});
```

## F2. Lead API contract (apps/hai-brain/app/api/lead/route.test.ts)
```ts
describe("POST /api/lead", () => {
  it("rejects without email → 400 exact message", async () => {
    const res = await POST(new Request("http://x", {method:"POST", body:"{}"}));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, error: "A valid email is required." });
  });
  it("accepts valid email + attribution, persists, returns ok", async () => {
    const res = await POST(new Request("http://x", {method:"POST", body: JSON.stringify({
      email: "jane@company.com", gclid: "abc", utm_medium: "cpc",
      pageview_count: 7, session_count: 3,
    })}));
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(true);
    // assert Convex row: channel "Paid Search", platform "Google Ads", counts preserved
  });
  it("rejects invalid email format", async () => {
    const res = await POST(new Request("http://x", {method:"POST", body: JSON.stringify({email:"nope"})}));
    expect(res.status).toBe(400);
  });
});
```

## F3. Playwright embed E2E (apps/hai-brain/e2e/embed.spec.ts)
```ts
test("embed form reports height and submits", async ({ page }) => {
  await page.goto("/f/demo-request-ux7tu?embed=1");
  await expect(page.locator("body.embed")).toBeVisible();
  // parent-side harness page that listens for hai-form-height
  await page.evaluate(() => {
    (window as any).__heights = [];
    window.addEventListener("message", (e) => {
      if (e.data?.type === "hai-form-height") (window as any).__heights.push(e.data.height);
    });
  });
  await page.fill('input[type="email"]', "jane@company.com");
  await page.fill('input[type="text"]', "Jane");
  await page.selectOption("select", { index: 1 });
  await page.fill("textarea", "Looking for shadow AI discovery and red teaming.");
  await page.click("button");
  await expect(page.getByText(/thank you|request received/i)).toBeVisible();
});

test("shadow-DOM form fields are tracked", async ({ page }) => {
  await page.setContent(`
    <script src="/hai-track.js" data-activity="on"></script>
    <my-form><form><input name="email"></form></my-form>`);
  // attach shadow root, type, assert HAITrack.activity().queued grows
});
```

## F4. sendBeacon-blocked resilience
```ts
test("blocked beacon does not crash; fetch fallback fires", async ({ page }) => {
  await page.route("**/api/visit", (route) => route.abort()); // simulate ERR_BLOCKED_BY_CLIENT
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/?utm_source=test&utm_medium=cpc");
  await page.waitForTimeout(1000);
  expect(errors).toEqual([]);
});
```

---

# PART G — Tracker Port Map (hai-track.js → files)

| Original section (lines) | Ported location | Key behavior |
|---|---|---|
| Header/config (1–52) | `public/hai-track.js` top | dataset config, API origin default = self-origin |
| Storage (53–68) | same | try/catch read/write/remove |
| Identity (69–95) | same | visitorId 32-hex crypto |
| Channel taxonomy (96–271) | **`packages/attribution`** (shared) | AI/SEARCH/SOCIAL/WEBMAIL/SELF/CLICK_IDS tables + classify() |
| Capture visit (272–318) | tracker | currentVisit() from location+referrer, click-id extraction |
| Session/counters (319–341) | tracker | 30-min window, counts |
| Attribution state (342–367) | tracker | first/last touch, hasSignal, 400-day expiry |
| Form identification (368–400) | tracker | formName heuristics + formContext |
| Public payload (401–460) | `packages/attribution/payload.ts` | fields() = last+first+counts+formContext |
| Pageview beacon (461–506) | tracker + `/api/visit` | text/plain Blob, /api/visit path, fetch fallback |
| Consent gate (507–514) | tracker | consented() + pending replay |
| Form activity (515–694) | tracker + `/api/form-activity` | queue, ACTIVITY_VALUES allowlist, composedPath fix, flush rules |
| Init (695–753) | tracker | recordVisit→beacon→fillHiddenFields→watchFormActivity; SPA patch; MutationObserver |
| Public API (754–812) | tracker | window.HAITrack v2.0.0 surface |

---

# PART H — Definition of Done (per phase)

| Phase | Gate |
|---|---|
| 0 | typecheck+test green; Convex dev deployed; both apps build on Vercel |
| 1 | 15 collections + 9 taxonomies seeded; draft/publish cycle works |
| 2 | home + all static pages render; sitemap 758 URLs; robots disallows present; Lighthouse ≥95 |
| 3 | all collection/category/persona pages render from CMS; ISR revalidation works |
| 4 | form embeds on /demo; theme params apply; validation blocks bad input |
| 5 | classifier 100% test coverage; tracker parity checklist passes; E2E lead journey green; HubSpot contact updated |
| 6 | consent gates all tracking; newsletter → lead; thank-you flow |
| 7 | headers match; rate limiter active; 100rps load test passes |
| 8 | channel conversion dashboard from real data |
| 9 | full parity checklist ✅; prod smoke passes; launch |

**Open decision (must answer before Day 32):** consent gating — ship `data-consent="required"` (recommended, GDPR) or replicate ungated original behavior.
