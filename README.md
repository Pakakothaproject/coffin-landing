# CoffinMail — the marketing site

www.coffinmail.com. A Vite + React static site: one page of marketing, built
from the engraved footer and the same video the app's whole idea is built on.

The application lives in a separate repository and is served from
`app.coffinmail.com`. This one is only the site people arrive on.

```bash
npm install
npm run dev        # http://localhost:5174
npm run build      # -> dist
npm run preview    # serve the build on 4174
node check-price.mjs
```

## What is here

| Route | |
|---|---|
| `/` | the hero over the engraving, what you get, the ladder, the promises, the price, the questions |
| `/features` | everything included, and what this is not |
| `/pricing` | the full schedule, and the free trial |
| `/privacy`, `/terms` | in plain terms |
| anything else | a 404 that still has the links |

## The two things that will bite if you forget them

**The engraving.** `src/VideoScene.jsx` fetches `public/viaduct.mp4` as a
whole file and plays it from a blob. That is deliberate: the streaming path
stalled after `loadedmetadata` in a real browser. Do not switch it back to a
plain `src`, and do not put a 10-bit HEVC file in `public/` — Chrome on Windows
refuses those with "no supported source" while Chrome for Testing plays them, so
the tests pass and the browser does not.

**The price table.** The schedule on `/pricing` is written out twice, and
`check-price.mjs` fails if either disagrees with `vendor/engine.js` — a mirror
of the app's own formula. When the price changes in the app repository, copy the
engine across and rerun it:

```bash
cp ../coffin-mail/supabase/functions/_shared/engine.js vendor/engine.js
node check-price.mjs
```

## Deploying

Any static host. Cloudflare Pages with:

| | |
|---|---|
| build command | `npm run build` |
| output directory | `dist` |

`public/_redirects` is the SPA fallback, so `/pricing` and the rest resolve to
`index.html` rather than 404ing on a hard refresh.