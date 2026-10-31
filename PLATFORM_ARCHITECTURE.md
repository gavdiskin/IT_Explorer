# Inside Thailand Explorer — Platform Architecture Brief

> **Status:** planning document for the v2 "ecosystem" rebuild.
> **Purpose:** the starting spec to hand to a local Claude Code session so the build
> begins from a clear plan rather than from scratch. Read this first, then `SETUP.md`.

---

## 1. The product in one sentence

Inside Thailand Explorer is a **structured knowledge base of Thailand travel content**
(places, destinations, transport, guides, practical info), surfaced through **multiple
front-ends**: an SEO web app, an iOS + Android mobile app, and an AI assistant — all
managed through a **no-code CMS**.

The single most important idea: **it is not a map, it is a knowledge base with a flexible
taxonomy.** The map is just one view. Everything is connected through categories, tags, and
relationships so users discover content naturally through search, filters, and recommendations.

## 2. The four strategic objectives

Every feature must serve at least one:

1. **Discovery** — make it effortless to find the best of Thailand.
2. **Growth** — SEO pages, shareability, app-store presence.
3. **Trust & Safety** — the moat. Scam awareness, fair-price benchmarks, verified content.
   *Never trade this away for raw volume — Google wins on volume, we win on trust.*
4. **Monetisation** — affiliates, booking partners, later.

## 3. Architecture pattern: one backbone, many windows

```
                 ┌─────────────────────────────┐
                 │   Postgres (knowledge base) │   ← the single source of truth
                 └──────────────┬──────────────┘
                                │
                 ┌──────────────┴──────────────┐
                 │   Directus (headless CMS)   │   ← no-code admin + REST/GraphQL API
                 └──────────────┬──────────────┘
                                │  (one content API)
        ┌───────────────┬───────┴────────┬──────────────────┐
        │               │                │                  │
   ┌────┴────┐    ┌─────┴─────┐    ┌─────┴──────┐    ┌──────┴──────┐
   │ Next.js │    │ Expo app  │    │ AI assist  │    │ future:     │
   │ SEO web │    │ iOS+Android│   │ (RAG over  │    │ partners,   │
   │         │    │ (1 codebase)│  │  the KB)   │    │ bookings... │
   └─────────┘    └───────────┘    └────────────┘    └─────────────┘
```

**Key principle:** front-ends never own data or business rules. They read/write through the
content API. Add a new surface later (e.g. a partner dashboard) without touching the others.

## 4. Recommended stack (and why)

| Layer | Choice | Why |
|---|---|---|
| **Database** | **PostgreSQL** | Relational data with a flexible taxonomy needs real joins, foreign keys, full-text search. Runs locally in Docker; managed in prod later. |
| **CMS / content API** | **Directus (self-hosted)** | No-code admin over an *existing* Postgres, flexible relationships/taxonomy, auto REST+GraphQL APIs, roles/permissions, file storage. **Free** under its Innovation Grant for orgs <$5M income & <50 employees. Runs fully offline. |
| **Web (SEO)** | **Next.js (App Router)** | Best-in-class server rendering / static generation for indexable destination, guide, and collection pages. (The current prototype is already Next.js — its content & lessons carry over.) |
| **Mobile (iOS + Android)** | **Expo / React Native** | One codebase → both app stores. Reuses the React + TypeScript you already know from the web app, and can share types/logic. (Flutter is viable but means a new language and zero code reuse.) |
| **AI assistant** | **LLM over the KB (RAG)** | The structured knowledge base is what makes good answers possible — the assistant retrieves from your own places/guides. This is where a clean taxonomy pays off. |
| **Auth** | **Directus auth** (decide vs Supabase) | Pick one identity provider for all surfaces. See open decisions. |

**Do not switch databases away from Postgres.** It's the one constant the whole platform leans on.

## 5. The knowledge-base data model (starting shape)

Design **multi-country from day one** (cheap), but **launch Thailand-only**. Every core
entity carries a `country` / `region` reference so adding Vietnam later is not a rebuild.

**Core entities**
- `countries` → `regions` → `destinations` (cities/areas, e.g. Bangkok, Phuket, Chiang Mai)
- `places` (the heart): name, description, coords, price level, rating, photos, hours,
  address, contact, `google_place_id`, status, source/verification fields
- `categories` (food, café, temple, beach, nightlife, transport…) — hierarchical
- `tags` (halal, rooftop, family-friendly, cash-only…) — flat, many-to-many
- `transport`: `transit_lines` → `stations` → `routes`; places link to nearest station
- `guides` / `editorial` (destination guides, transport guides, visa, scams, phrasebook…)
- `collections` (curated sets: "Best street food in Bangkok") — power SEO pages
- `experiences` / `activities`, `accommodation` (later phases)

**Relationships (the taxonomy is the product)**
- place ↔ category (many-to-one or many-to-many)
- place ↔ tags (many-to-many)
- place ↔ destination (many-to-one)
- place ↔ nearest station(s)
- guide ↔ places (a guide references many places)
- collection ↔ places (ordered membership)

**Trust & Safety fields** (first-class, not an afterthought): `verified_by`, `verified_at`,
`price_benchmark`, `scam_warnings`, `source`. These differentiate the product.

> An ERD (visual entity-relationship diagram) can be generated from this once the model is
> agreed — useful as a one-page reference.

## 6. Phased roadmap (ship value, don't boil the ocean)

The biggest risk for a solo founder is building everything at once and shipping nothing.
Each phase must produce something usable.

- **Phase 0 — Backbone.** Local Postgres + Directus. Define the data model & taxonomy.
  Import the existing ~137 places + guides as the seed. *(See `SETUP.md`.)*
- **Phase 1 — SEO web app.** Next.js reading from the content API. Destination pages,
  guides, collections, category/tag pages. **Launch this first — SEO is a clock that starts
  ticking the day you publish, and it's your cheapest growth channel.**
- **Phase 2 — Mobile app.** Expo app for discovery, map, save/plan, offline basics.
  Wrap to both app stores.
- **Phase 3 — Intelligence & money.** AI assistant (RAG), itinerary planning, affiliate /
  booking partners, analytics.

## 7. What to carry over from the prototype (do NOT restart at zero)

- **The data** — ~137 places, categories, guides, stations, taxonomy seeds. Re-keying would
  be wasted effort. Export from the current Supabase Postgres → import to the new Postgres.
- **The trust & safety content** — scams, fair-price benchmarks, emergency info, phrasebook.
  This is the differentiator; keep it central.
- **Hard-won lessons** — Row-Level-Security model, the static-first loading pattern, the
  input-validation layer (`src/lib/validation.ts`), the design system tokens.
- **Note:** the live Supabase DB already has the security fixes (#1–#5) applied. If the new
  platform reuses that same database, those protections come along for free.

## 8. Open decisions to resolve at the start of the build

1. **CMS: confirm Directus** (recommended) vs Strapi/Payload. *Directus = wraps existing
   Postgres + no-code; best fit for carrying the data over.*
2. **Auth provider** — Directus users vs keep Supabase Auth. Pick one for all surfaces.
3. **Reuse the existing Supabase Postgres, or start a fresh local Postgres and import?**
   (Recommended: fresh local for offline dev; sync to managed Postgres for prod.)
4. **Image/photo storage** — Directus file storage (local) → object storage (S3/R2) in prod.
5. **AI provider & approach** — RAG over the KB; which model; cost guardrails.
6. **Monorepo vs separate repos** for cms / web / mobile (recommended: monorepo).
7. **"From scratch" scope** — agreed this means new *surfaces*, not new *data*.

---

*This brief is a starting point, not a contract — expect it to evolve as the model is built.*
