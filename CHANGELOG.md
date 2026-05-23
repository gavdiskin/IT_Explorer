# Changelog — Inside Thailand Explorer

All significant changes to this project are documented here.

---

## [Unreleased] — active development on `claude/busy-rubin-5UsMp`

### Auth & User Accounts
- Supabase Auth wired end-to-end (email + password, Google OAuth)
- `AuthProvider` session listener — syncs `signedIn`, `userId`, `userEmail` to Zustand on mount and on every auth state change
- Sign-in page: real email/password with sign-in / create-account tab toggle, Google OAuth button, confirmation screen after sign-up
- Google OAuth: `prompt: select_account` forces account picker on every sign-in so users can switch accounts
- `/auth/callback` page handles OAuth code exchange (PKCE flow) then redirects home
- Sign-out calls `supabase.auth.signOut()` before clearing Zustand state
- Account page: shows real user initials/email from session, working city selector, working cannabis toggle — all hardcoded placeholder data removed

### Saved Places (persisted)
- `saved_places` table rebuilt: `user_id uuid → auth.users`, `place_slug text → places.slug`, unique constraint, RLS policies (users read/write own rows only)
- `toggleSave`: optimistic Zustand update + fire-and-forget DB upsert/delete when signed in
- On sign-in, saved place slugs are loaded from DB and populate the Zustand set
- `profiles` table: auto-created on new user signup via Postgres trigger

### Supabase Database
- Project: `Thailand_Map_Explorer_V2` (`mjchpgmwwvloclrimyja.supabase.co`)
- 45 places seeded (35 Bangkok, 10 Phuket, 1 optional/cannabis)
- 16 categories seeded with accent colours, icons, tone values
- All major pages wired to Supabase with static data fallback (no loading spinner, graceful degradation)
- `fetchPlaces`, `fetchPlace`, `fetchCategories`, `fetchSavedSlugs`, `upsertSaved`, `deleteSaved` in `src/lib/db.ts`
- `usePlaces(city)`, `usePlace(slug)`, `useCategories()` hooks in `src/hooks/usePlaces.ts`
- RLS enabled on all tables; public SELECT on places/categories; auth required for saved_places

### Pages wired to live data
- `/` (home) — featured places from DB
- `/map` — all city places from DB, pin clicks, mobile sheet
- `/cities/[slug]` — city places from DB
- `/categories/[slug]` — city places filtered by category from DB; metadata count from DB
- `/places/[slug]` — individual place from DB; metadata from DB

### Google Maps
- Replaced placeholder map with `@vis.gl/react-google-maps` v1.8.3
- Real coordinates for all 45 places
- Pin clustering, selected-pin popup, mobile drawer

### Next.js / Infrastructure
- Migrated from Vite + JSX to Next.js 15 App Router with TypeScript strict mode
- 19 hash routes converted to real URL paths via App Router file structure
- Zustand v5 store: `city`, `savedSet`, `signedIn`, `userId`, `userEmail`, `showCannabis`, `drawerOpen`
- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` set in Vercel (Production + Preview)
- `NEXT_PUBLIC_GOOGLE_MAPS_KEY` set in Vercel
- Supabase client tolerant of missing env vars — falls back to static data rather than crashing
- `generateMetadata` + `sitemap.xml` + `robots.txt` for SEO
- Deployed to Vercel: `it-map-explorer-prototype-v2w-figma.vercel.app`

### Supabase Auth Configuration
- Site URL: `https://it-map-explorer-prototype-v2w-figma.vercel.app/`
- Redirect URLs: `https://*.vercel.app/**`
- Google OAuth provider: Client ID + Secret configured, callback `https://mjchpgmwwvloclrimyja.supabase.co/auth/v1/callback`
- Email confirmation: currently disabled for testing (re-enable before production launch)

---

## Known / Pending
- Recently viewed tracking (not yet implemented — requires a `place_views` table)
- User contributions tracking (requires querying `user_submissions` by user)
- Real photos — `Slot` SVG placeholders remain; Supabase Storage not yet wired
- `/submit` form — UI exists, backend insert to `user_submissions` not yet wired
- `/stations/[slug]` — still uses static STATIONS data
- Language / Notifications settings — UI rows removed pending implementation
- Email confirmation should be re-enabled before production launch
