# ACE GECW website

A single-page static site (HTML, CSS and a little JavaScript, no build step).
It is served by GitHub Pages at **https://csegecw.github.io**.

## Edit

- `index.html`: text, nav links, focus pills, stats (the stats are placeholders, replace them).
- `styles.css`: colours (`:root` variables at the top), fonts, spacing.
- `script.js`: background dot effect and count-up numbers.

## Preview locally

```bash
cd csegecw.github.io
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Publish (GitHub Pages)

The repository must be named exactly `csegecw.github.io` so the site lives at the root URL.

1. Sign in to GitHub as `csegecw` (or as a member of that account with repo rights).
2. Create a new **public** repository named `csegecw.github.io`.
3. Push these files to the `main` branch:

   ```bash
   git init -b main
   git add .
   git commit -m "Initial ACE GECW landing page"
   git remote add origin https://github.com/csegecw/csegecw.github.io.git
   git push -u origin main
   ```

4. In the repository, go to **Settings → Pages**. Under *Build and deployment*, set *Source* to
   **Deploy from a branch**, branch `main`, folder `/ (root)`, then save.
5. Wait 1 to 2 minutes, then open https://csegecw.github.io.
