# IT_MapExplorer_Prototype_v2w_figma

The map explorer built with Claude Design and the Figma diagram.

A mobile-first responsive web app for discovering Thailand — places, categories,
city guides, transport, scam detector, price checker, phrasebook, emergency
numbers, SIM finder. Built as a React + Vite single-page app, deployable on Vercel.

## Live demo

Deployed on Vercel: _add your URL here once deployed_

## Stack

- **React 18** + **Vite 6** (ES modules, fast HMR)
- Hash-based client-side routing (no React Router — custom 60-line router)
- CSS custom properties for the design system (no CSS framework)
- SVG-based map placeholder — drop-in replaceable with the real Google Maps API
- No backend; all data is in `src/data.js`

## Local development

\`\`\`bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # serve the production build locally
\`\`\`

## Project structure

\`\`\`
src/
  main.jsx           Entry point
  app-root.jsx       App shell, route dispatch, global state, tweaks panel
  styles.css         Design tokens + utility classes (no Tailwind / CSS-in-JS)
  data.js            All seed data (places, categories, cities, scams, prices, guides)
  router.jsx         useRoute / navigate / Link — hash routing
  shell.jsx          Header, footer, mobile drawer + bottom nav, useAuth
  shared.jsx         Reusable: Slot, PriceMark, StarRating, PlaceCard, CategoryTile
  icons.jsx          Custom SVG icon set
  gmap.jsx           SVG Bangkok map placeholder
  tweaks-panel.jsx   Floating dev panel (Ctrl+. or "Tweaks" FAB)
  pages/
    home.jsx         Three home variants: hub / mapfirst / editorial
    map.jsx          Three map variants: split / floating / drawer
    place.jsx        Single place + 404
    discovery.jsx    Category, City, Station, Guides, Transport pages
    tools.jsx        Tools hub + Scam, Price, Phrasebook, Emergency, SIM
    account.jsx      Saved, Submit a place, Account, Sign in
\`\`\`

## Routes

| Hash                       | Page                       |
| -------------------------- | -------------------------- |
| `#/home`                   | Home (3 layout variants)   |
| `#/map`                    | Map (3 layout variants)    |
| `#/place/:id`              | Single place detail        |
| `#/category/:id`           | Browse by category         |
| `#/city/:id`               | City guide                 |
| `#/station/:id`            | BTS/MRT station + places   |
| `#/guides` · `#/guides/:id`| Practical guides           |
| `#/transport`              | Transport overview         |
| `#/tools`                  | Tools hub                  |
| `#/tools/scams`            | Scam detector              |
| `#/tools/prices`           | Price checker              |
| `#/tools/phrasebook`       | Survival Thai              |
| `#/tools/emergency`        | Emergency numbers          |
| `#/tools/sim`              | SIM finder                 |
| `#/saved`                  | Saved places (auth-gated)  |
| `#/submit-place`           | Submit a place (auth-gated)|
| `#/account`                | Account                    |
| `#/signin`                 | Sign in                    |

## Tweaks panel

A floating dev panel (bottom-right FAB or `Ctrl + .`) lets you switch between
layout variants and toggle the signed-in state without leaving the page —
useful for design review.

## Replacing the placeholder map

`src/gmap.jsx` renders an inline SVG of Bangkok with category-colored pins.
To swap in real Google Maps, replace the `GMap` component's body with a
`@vis.gl/react-google-maps` `<Map>` and pass the same `pins` / `selectedId` /
`city` props. The rest of the app doesn't need to change.

## Deploying to Vercel

1. Import this repo on Vercel.
2. Framework preset: **Vite** (auto-detected).
3. No environment variables required.
4. Deploy — it's a static SPA, no server runtime.

## Credits

Designed in [Claude Design](https://claude.ai/design), implemented by Claude Code.