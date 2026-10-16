# Holistic AI Recreation — Progress

## 🔑 Credentials wired + repo published (latest)

### Local stack now Docker-backed
- **Postgres 17 in Docker** on **host port 5434** (`docker compose up -d`).
  This machine already runs **PostgreSQL 17 on 5432** *and* **PostgreSQL 13 on 5433**,
  so the container avoids both. Volume: `holisticai-pgdata`.
- Migrated + seeded + imported into the container: **610 docs, 43 taxonomies,
  371 category links**. Verified by an inbound connection from the host
  (`pg_stat_activity` shows `172.28.0.1` — the Docker bridge gateway).
- **Convex** deployed to **`blissful-narwhal-823`** (the user's own project, not the
  throwaway `marvelous-platypus-539`). Verified live.
- **Upstash rate limiter** live — verified 10 allowed then `429`s.
- **GitHub**: pushed to `github.com/YaHuy1525/Govly` — `main`, no secrets in tree.

### ⚠️ HubSpot token is INVALID — needs replacing
`HUBSPOT_ACCESS_TOKEN` returns **401 Unauthorized** from `api.hubapi.com/crm/v3/objects/contacts`.
The supplied value base64-decodes to a protobuf blob containing app id `ap1-d6b8-…`; HubSpot
private-app tokens are plain strings beginning **`pat-eu1-`** (EU) or `pat-na1-` (NA).
Get the right one from HubSpot → Settings → Integrations → **Private Apps** → app → **Auth** tab,
scope `crm.objects.contacts.write`. Sync code is correct and waiting; it stays a no-op until then.

### Secrets generated this session (values only in gitignored `.env` files)
| Var | Where |
|---|---|
| `PAYLOAD_SECRET` | `apps/cms/.env` |
| `PREVIEW_SECRET` | `apps/web/.env.local` |
| `FORMS_ADMIN_TOKEN` | `apps/hai-brain/.env.local` |

### Bugs found & fixed
1. **Silent wrong-database fallback** — `payload.config.ts` read `process.env.DATABASE_URI`
   *before* the calling script's `dotenv()` ran (ESM imports are hoisted), so it fell back to a
   hardcoded 5432 URI and failed auth confusingly. Now the config loads `.env` itself and
   **throws** if `DATABASE_URI` is missing instead of guessing.
2. **`.env` written with CRLF** by Python's `write_text` → trailing `\r` in the connection
   string. Now written with `newline="\n"`.
3. **130 unhandled rejections in the tracker suite** — the no-op `sendBeacon` was installed
   behind a `typeof !== "function"` guard, but happy-dom ships a *real* one that does network
   I/O. Now overridden unconditionally.
4. **106 MB `evidence/rea-js-analysis.json`** would be rejected by GitHub — gitignored.
5. **Docker port collision (5433)** — the container started "healthy" but Docker could not
   publish a host port already held by the machine's PostgreSQL 13, so every
   `localhost:5433` connection silently went to PG 13 instead of the container and the
   Docker volume stayed empty (4 KB). Moved to **5434** and confirmed the data landed in
   the container this time. **Lesson: verify a container's port actually serves it** —
   `docker exec … psql` proves nothing about the host-published port.

---

## ✅ ALL OPTIONAL ITEMS COMPLETE — full system, verified end-to-end

### Ports (changed this session)
| App | Port | Why |
|---|---|---|
| `@hai/cms` — Payload 3.90 + Postgres 17 | **3010** | 3000 is occupied by an unrelated Flask app on this machine |
| `@hai/hai-brain` — form + APIs | 3001 | |
| `@hai/web` — marketing site | 3002 | |

### Test suites — all green
| Suite | Result |
|---|---|
| `packages/attribution` (classifier parity) | **30/30 pass** |
| `apps/hai-brain` (tracker, happy-dom) | **14/14 pass** |
| `apps/web` (Playwright E2E) | **5/5 pass** |

Playwright covers: iframe embed renders · required-field validation · textarea 10–200 counter ·
invalid email rejected · postMessage height reporting.

### Verified routes (real requests, not claims)
- **12/12 collection archives** 200 — blog, glossary, news, papers, learn, media-coverage,
  newsletters, analyst-coverage, press-release, case-study, red-teaming, executive-bios
- **Article pages** 200 with rich-text body, breadcrumb, meta, reading time, TOC
- **Category pages** — `/[collection]/category/[slug]`, e.g. `/blog/category/shadow-ai` (13 cards),
  `/news/category/product` (17 cards)
- **Search** — `/search?q=governance` → 76 cards; `?q=audit` → 71 cards
- **`/sitemap.xml`** → **641 URLs** (was 43 before the content import)
- **`/robots.txt`** 200 (original's disallow list incl. `*__hstc=`)
- **`/api/preview`** → 401 without secret (correct); draft mode wired via `draftMode()`
- **hai-brain**: `/f/demo-request-ux7tu` 200, `/hai-track.js` 200, `/api/health` ok
- Unknown slugs → 404

### Content
- **610 content docs** imported from the original 758-URL sitemap (598 new)
- **43 taxonomy docs** (blog/news/event/paper categories, type-of-blog)
- **371 docs linked to categories** by keyword match + round-robin fallback

### Attribution (unchanged, still verified)
- `/api/lead` → Convex, `serverChannel: "Paid Search"` from gclid
- **Safety net**: client `Direct` + `utm_source: "chatgpt.com"` → server re-classified **"AI Assistant"**
- 12 channels, precedence AI → utm_medium → click ID → referrer → Direct
- 24 AI hosts, 23 click IDs, 11 search, 18 social

### Bugs found & fixed this session
1. **`listCollection` collapsed the where-clause** into a single broken `where=` param.
   Payload needs each `where[...]` key as its own param. Rewrote to take a
   `query: Record<string,string>` and set each key individually.
2. **Payload validates query paths per-collection** — searching `term`/`name` on `blog`
   400s the whole request. Added a per-collection `SEARCH_FIELDS` map.
3. **Next.js slug conflict** — `[collection]` and `[taxonomy]` can't coexist at the same
   level. Moved categories to `/[collection]/category/[slug]`.
4. **Import OOM** — per-slug `find()` queries exhausted Postgres memory at 600+ docs.
   Batched: fetch existing slugs once per collection, then create only the missing ones.

### Run it
```bash
cd D:\Code\HolisticAI
# CMS (port 3010 — 3000 is taken)
cd apps/cms && DATABASE_URI='postgresql://postgres:150205@localhost:5432/holisticai' PAYLOAD_SECRET=dev-secret npx next dev -p 3010
cd apps/hai-brain && npx next dev -p 3001
cd apps/web && CMS_URL=http://localhost:3010 npx next dev -p 3002
```

### Scripts (apps/cms/scripts/)
- `seed.mts` — one doc per collection + taxonomies
- `import-content.mts` — full 758-URL sitemap import (598 docs)
- `link-categories.mts` — keyword-match docs to categories (371 links)

All need: `DATABASE_URI=... PAYLOAD_SECRET=dev-secret npx tsx scripts/<name>.mts`

### Remaining (genuinely optional)
- HubSpot sync code exists but `HUBSPOT_ACCESS_TOKEN` is empty (no-op)
- Rate limiter uses in-memory fallback (Upstash not configured)
- Content bodies are placeholders ("imported from the original site structure") —
  real article text would need per-page scraping
- Collection category pages exist for blog/news/papers (the three with taxonomy relations)

### Gotchas (don't re-hit)
- Payload REST route folder MUST be `[...slug]`; admin runs via `next dev` not `payload run`
- Payload 3.90 migrations: drop `MigrateUpArgs`/`MigrateDownArgs` imports
- Payload wraps Lexical body in an outer `root` key — unwrap before rendering
- Payload query paths are validated per-collection (unknown field → 400, not empty result)
- `URLSearchParams` encodes brackets once — don't pre-encode values
- Convex bundler needs workspace deps in node_modules (`@hai/attribution: workspace:*`)
- pnpm: esbuild/sharp → `onlyBuiltDependencies` in root package.json
- Windows: heredocs mangle passwords in .env — use `node fs.writeFileSync`
- happy-dom on Node 26 has no `localStorage`; vitest needs the shim in tests/setup.ts
- Playwright's `webServer` will kill servers it started — use `reuseExistingServer: true`
