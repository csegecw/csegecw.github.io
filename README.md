# ACE · GEC Wayanad

Website of ACE, the Association of Computer Engineers at Government Engineering College Wayanad.
Vite + React, served by GitHub Pages at **https://csegecw.github.io**.

## Run locally

```bash
npm install
npm run dev
```

## Edit

- `src/content.js`: all text, including the ticker.
- `src/styles.css`: colours and fonts (tokens at the top), layout and animations.
- `src/components/AceLogo.jsx`: the logo, redrawn as SVG from the original artwork. The arrow and
  letters invert where they overlap.
- `src/components/Cursor.jsx`: the logo arrow as the mouse cursor, plus click rings.
- `src/arrow.js`: the arrow shape shared by the logo, cursor and favicon.

## Deploy

Every push to `main` builds the site and publishes it with GitHub Actions
(`.github/workflows/deploy.yml`).

One-time setup: in the repo, go to **Settings → Pages → Build and deployment** and set *Source* to
**GitHub Actions**.
