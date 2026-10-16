# Holistic AI — Recreation

A from-scratch recreation of holisticai.com + hai-brain (the first-party
attribution platform), built from the reverse-engineering analysis in `docs/`.

## Structure

```
holisticai-clone/
├── apps/
│   ├── web/        # Next.js 15 marketing site (Payload CMS frontend) — Phase 1–3
│   ├── hai-brain/  # Next.js 15 form app + attribution APIs + Convex — Phase 4–5
│   └── cms/        # Payload CMS 3 (15 collections) — Phase 1
├── packages/
│   ├── attribution/  # channel classifier + payload builders (ported from hai-track.js)
│   └── ui/           # design tokens (--hai-* palette, Geist, spacing)
├── infra/          # Cloudflare + Vercel config
├── docs/           # analysis + build plans
│   ├── RECREATION-SPEC.md
│   ├── BUILD-PLAN.md
│   └── BUILD-PLAN-DETAILED.md
├── artifacts/      # original site bundles (hai-track.js, webflow chunks, sitemap…)
└── evidence/       # REA analysis output (raw proof)
```

## Status

| Phase | State |
|---|---|
| 0 — Foundations | **DONE** (monorepo, @hai/attribution, @hai/ui, CI) |
| 1 — CMS model | pending |
| 2 — Marketing shell | pending |
| 3 — Collection pages | pending |
| 4 — Form app | pending |
| 5 — Attribution engine | classifier + payloads done; tracker port + APIs pending |
| 6–9 | pending |

## Commands

```bash
pnpm install
pnpm test          # vitest (attribution parity suite: 30 tests)
pnpm typecheck     # tsc --noEmit per package
pnpm build
```

## The attribution engine

`packages/attribution` is a faithful TypeScript port of hai-track.js v2.0.0's
channel taxonomy (see `src/tables.ts` for the verbatim port):

- **12 channels** — Direct, Organic/Paid Search, Organic/Paid Social, Display,
  Email, Affiliate, Referral, Campaign, AI Assistant, Internal
- **Precedence** — AI assistant → explicit utm_medium → click ID → referrer
  host → Direct (gemini.google.com is classified "AI Assistant", never
  "Google organic")
- **24 AI hosts** (ChatGPT, Perplexity, Claude, Gemini, Copilot, DeepSeek,
  Grok, Mistral…) — checked before search engines
- **23 click IDs** (gclid, fbclid, msclkid, mc_eid, _hsenc…)
- Self-referrals → `Internal` (not counted as acquisition)

Parity tests in `src/classify.test.ts` encode the precedence traps.

## Open decision

Consent gating: ship `data-consent="required"` (GDPR-correct) or replicate the
original's ungated tracking. See BUILD-PLAN-DETAILED.md §Day 32.
