# Inside Thailand Explorer

A mobile-first web app for discovering Thailand — places, categories, city guides,
transport, and practical tools (scam detector, price checker, phrasebook, emergency
numbers, SIM finder, essential apps). Data is backed by Supabase with a static
fallback so the app renders instantly and degrades gracefully when offline or
unconfigured.

## Live demo

Deployed on Vercel: https://it-map-explorer-prototype-v2w-figma.vercel.app

## Stack

- **Next.js 15** (App Router) + **React 18** + **TypeScript** (strict mode)
- **Supabase** — Postgres + Auth (email/password + Google OAuth) + Row Level Security
- **Google Maps** via [`@vis.gl/react-google-maps`](https://visgl.github.io/react-google-maps/)
- **Zustand** v5 for client state (`src/store/ui.ts`)
- Plain CSS with custom properties for the design system (`src/app/globals.css`) — no CSS framework
- `generateMetadata` + `sitemap.xml` + `robots.txt` for SEO

## How data flows (static-first)

Every data-backed page renders immediately from bundled seed data in
`src/data/index.ts`, then overlays live Supabase data once it loads. If the
Supabase env vars are missing or a request fails, the app silently keeps the
static data — no spinners, no crashes. The Supabase client itself is null-safe
(`src/lib/supabase.ts` returns `null` when env vars are absent and every `db.ts`
helper short-circuits to `[]`/`null`).

- `src/lib/db.ts` — all queries (`fetchPlaces`, `fetchPlace`, `fetchPlacesByStation`,
  `fetchCategories`, saved-places, recently-viewed, submissions, guides, apps, admin)
- `src/hooks/` — `usePlaces`, `usePlacesByStation`, `usePlace`, `useCategories`, `useRecentlyViewed`

## Environment variables

Set these in `.env.local` for development and in Vercel (Production + Preview):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
NEXT_PUBLIC_GOOGLE_MAPS_KEY=<maps-js-api-key>
```

Without them the app still runs on static seed data (no auth, no persistence).

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint (next lint)
```

## Project structure

```
src/
  app/
    (public)/            Public site — shared layout mounts AuthProvider
      page.tsx           Home
      map/               Full-screen Google Maps + filters + search
      places/[slug]/     Place detail (tracks views)
      categories/[slug]/ Browse by category
      cities/[slug]/     City guide
      stations/[slug]/   BTS/MRT station + nearby places (from DB)
      guides/            Practical guides (+ [slug])
      transport/         Transport overview
      tools/             Tools hub: scams, prices, phrasebook, emergency, sim
      saved/             Saved places (auth-gated, persisted)
      recently-viewed/   View history (localStorage + cross-device when signed in)
      submit/            Submit a place (auth-gated → user_submissions)
      account/ · signin/
    admin/               Admin panel: dashboard, users, submissions, guides, apps
    api/admin/apps/      Server route for app CRUD (bypasses ad-blocker POST issues)
    auth/callback/       OAuth / PKCE code exchange
    layout.tsx
  components/{ui,layout,map}   Typed React components
  hooks/                 Data hooks (static-first Supabase overlay)
  lib/                   db.ts, supabase.ts, recentlyViewed.ts
  store/ui.ts            Zustand store (city, savedSet, auth, cannabis toggle)
  data/index.ts          Seed + fallback data (places, categories, stations, scams, prices, guides)
  types/index.ts         Shared TypeScript types
```

## Database (Supabase)

Public read tables: `places`, `categories`, `guides`, `essential_apps`.
Per-user tables (RLS — users only touch their own rows): `saved_places`,
`place_views`, `profiles`. Contributions go to `user_submissions` (public insert,
admin review). Admin role is read from `profiles.role` via the `get_my_role()` /
`get_users_with_roles` RPCs.

## Auth

`AuthProvider` (mounted in the public layout) calls `getSession()` on mount and
subscribes to `onAuthStateChange`, syncing `signedIn` / `userId` / `userEmail` /
`role` into the Zustand store. Sign-in supports email/password and Google OAuth
(`prompt=select_account`); `/auth/callback` handles the PKCE exchange.

> **Before production:** re-enable email confirmation in Supabase Auth (disabled
> during testing).

## Deploying to Vercel

1. Import the repo on Vercel — framework preset **Next.js** (auto-detected).
2. Add the three `NEXT_PUBLIC_*` environment variables above.
3. In Supabase Auth, set the Site URL and add `https://*.vercel.app/**` to redirect URLs.
4. Deploy.

## Credits

Designed in [Claude Design](https://claude.ai/design), implemented by Claude Code.
