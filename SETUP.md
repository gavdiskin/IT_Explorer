# Local Development Setup — Inside Thailand Explorer (v2)

> **Goal:** a fully **local, offline-capable** development stack — Postgres + self-hosted
> Directus (CMS) + Next.js (web) + Expo (mobile). After the one-time installs below, it all
> runs on your laptop with the wifi off.
>
> **How to use this:** open **Claude Code on your laptop** in an empty project folder and say
> *"Set up the stack described in SETUP.md."* It will run the commands and fix errors live.
> A few steps (marked 👤) need you to click an installer or enter a password.

---

## 0. One-time prerequisites (need internet — 👤 you install these)

| Tool | What it is | Get it |
|---|---|---|
| **Docker Desktop** | Runs Postgres + Directus locally in "containers" | https://www.docker.com/products/docker-desktop/ |
| **Node.js (LTS)** | Runs the web & mobile tooling | https://nodejs.org (or `nvm`) |
| **Git** | Version control | https://git-scm.com |
| **Claude Code** | The local agent that builds it | https://www.anthropic.com/claude-code |
| **VS Code** (optional) | Editor | https://code.visualstudio.com |

> ⚠️ **Internet is only needed for these installs and the first `docker compose up`** (it
> downloads the images). After that the stack runs offline. The map tiles and AI assistant
> still need internet *when you actually use those specific features*.

Verify after installing:
```bash
docker --version
node --version      # v20+ recommended
git --version
```

## 1. Folder structure (monorepo)

```
inside-thailand/
├── docker-compose.yml      # Postgres + Directus
├── .env                    # secrets (NEVER commit — see .gitignore)
├── cms/                    # Directus uploads/extensions (created by Docker)
├── web/                    # Next.js SEO web app
├── mobile/                 # Expo iOS+Android app
└── db/                     # SQL dumps / seed data
```

## 2. The database + CMS (Postgres + Directus via Docker)

Create **`docker-compose.yml`** in the project root:

```yaml
services:
  database:
    image: postgis/postgis:16-3.4        # Postgres 16 + PostGIS (geo queries for maps)
    restart: unless-stopped
    environment:
      POSTGRES_USER: directus
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: inside_thailand
    volumes:
      - ./db/data:/var/lib/postgresql/data
    ports:
      - "127.0.0.1:5432:5432"            # this laptop only — not other devices on the wifi

  directus:
    image: directus/directus:latest
    restart: unless-stopped
    ports:
      - "127.0.0.1:8055:8055"            # this laptop only — see the note below
    volumes:
      - ./cms/uploads:/directus/uploads
      - ./cms/extensions:/directus/extensions
    environment:
      SECRET: ${DIRECTUS_SECRET}
      DB_CLIENT: pg
      DB_HOST: database
      DB_PORT: 5432
      DB_DATABASE: inside_thailand
      DB_USER: directus
      DB_PASSWORD: ${DB_PASSWORD}
      ADMIN_EMAIL: ${ADMIN_EMAIL}
      ADMIN_PASSWORD: ${ADMIN_PASSWORD}
      WEBSOCKETS_ENABLED: "true"
    depends_on:
      - database
```

> 🔒 **Why `127.0.0.1:`?** A plain `"8055:8055"` makes Docker open the port to **every device on
> the same network** — so on café or coworking wifi, anyone nearby could reach your CMS admin
> and database. Prefixing `127.0.0.1:` keeps them reachable from this laptop only. Directus still
> talks to Postgres over Docker's internal network (`DB_HOST: database`), so nothing breaks.

Create **`.env`** in the project root (and add `.env` to `.gitignore`). Replace every
`change-me` value with a real random secret — generate each one with `openssl rand -base64 32`:

```bash
DB_PASSWORD=change-me-strong-password
DIRECTUS_SECRET=change-me-any-long-random-string
ADMIN_EMAIL=you@example.com
ADMIN_PASSWORD=change-me-admin-password
```

Start it:
```bash
docker compose up -d      # first run downloads images (needs internet)
```

- **Directus admin:** http://localhost:8055 (log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`)
- **Content API:** http://localhost:8055/items/... (REST) and `/graphql`
- **Postgres:** localhost:5432

In the Directus admin you build the data model from `PLATFORM_ARCHITECTURE.md` §5 — no code:
collections (countries, destinations, places, categories, tags, transit_lines, stations,
guides, collections) and the relationships between them.

## 3. The web app (Next.js)

```bash
npx create-next-app@latest web --typescript --app --eslint
cd web
# .env.local:
#   NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055
#   NEXT_PUBLIC_GOOGLE_MAPS_KEY=...   (your existing key)
npm run dev      # http://localhost:3000
```
Use the Directus SDK (`@directus/sdk`) to read content. Build static/server-rendered pages for
destinations, guides, collections, categories — these are the SEO surface.

## 4. The mobile app (Expo — iOS + Android, one codebase)

```bash
npx create-expo-app@latest mobile
cd mobile
npx expo start      # press 'a' = Android emulator, 'i' = iOS simulator (Mac only)
```
- **Android emulator** runs fully offline on any OS (needs Android Studio installed).
- **iOS simulator** needs a **Mac + Xcode**.
- **Physical phone:** install **Expo Go** and scan the QR — phone + laptop on the same wifi
  (local network, not the internet). Because the CMS is bound to `127.0.0.1`, the app on a real
  phone can't reach it. When you need that, and **only on a trusted home network with real
  secrets in `.env`**, temporarily change the Directus port to `"8055:8055"`, point the app at
  your laptop's network IP (e.g. `http://192.168.1.20:8055`), and switch back afterwards.
  (No change is needed for the simulators: the iOS simulator reaches the CMS at
  `http://localhost:8055`, and the Android emulator reaches your laptop at `http://10.0.2.2:8055`.)

## 5. Import the existing data (carry over the ~137 places)

From the current Supabase project, export the relevant tables, then load into local Postgres:
```bash
# example: dump specific tables from the live DB (run once, needs internet)
pg_dump "postgresql://...supabase-connection-string..." \
  --data-only --table=public.places --table=public.categories \
  --table=public.guides --table=public.stations > db/seed.sql

# load into local Postgres
docker compose exec -T database psql -U directus -d inside_thailand < db/seed.sql
```
> Map the old columns to the new Directus collections as you go — treat this as data
> migration, not a straight copy. Claude Code can write the transform.

## 6. Daily workflow

```bash
docker compose up -d        # start DB + CMS
cd web && npm run dev        # web on :3000
cd mobile && npx expo start  # app
# ... build ...
docker compose down          # stop everything
```

## 7. What needs internet vs works offline

| Works offline ✅ | Needs internet 🌐 |
|---|---|
| Postgres, Directus, the content API | First `npm install` / `docker compose up` |
| Next.js dev server, Expo, Android emulator | Google Maps tiles (the map view) |
| Editing content, the data model, all UI | AI assistant (LLM calls) |
| Building & debugging code | Publishing / app-store submission |

## 8. Security reminders (carried from the prototype)

- Never commit `.env`, secrets, or API keys. Service/admin credentials stay server-side only.
- Reproduce the Row-Level-Security discipline: scope every table; no public write-all policies;
  bind user-owned rows to the authenticated identity.
- Re-enable email confirmation before any public launch.

---

*Hand this file to local Claude Code and it will execute it step by step.*
