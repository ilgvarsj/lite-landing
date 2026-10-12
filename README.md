# lite.lv — Astro

A modern static rebuild of [lite.lv](https://lite.lv) (SIA LITE: window blinds, curtains and outdoor shading made in Latvia).

## Requirements

Node ≥ 20.3 (see `.nvmrc`):

```sh
nvm use        # Node 24
npm install
npm run dev    # http://localhost:4321
npm run build  # static output in dist/
npm run check  # type-check .astro/.ts
```

## Structure

| Path | What |
| --- | --- |
| `src/content/produkti/<path>/index.md` | Product pages; the folder path is the URL under `/produkti/`. Images sit next to the Markdown and are listed in front matter (`cover`, `gallery`). |
| `src/content/lapas/` | Other imported pages (Par mums, Tehniskā informācija, Dīleri). |
| `src/data/site.ts` | Company details, both locations, category order and blurbs, links to sections not migrated yet. |
| `src/i18n/lv.ts` | UI strings. Add `en.ts` / `ru.ts` with the same keys to translate. |
| `src/lib/catalog.ts` | Product tree helpers (categories, children, breadcrumbs, nav). |
| `src/components/`, `src/layouts/` | UI. Styling is Tailwind CSS v4; brand tokens are in `src/styles/global.css`. |
| `scripts/scrape.py` | One-off importer from the old WordPress REST API (not part of the build). |

URLs match the old WordPress site (trailing slashes, `/home-lat/par-mums/`, etc.) to preserve SEO.

## Adding / editing a product

Create `src/content/produkti/<category>/<slug>/index.md`:

```md
---
title: "Rullo žalūzijas"
description: "Meta description for search engines"
cover: ./cover.jpg
coverAlt: "Rullo žalūzijas guļamistabā"
gallery:
  - src: ./photo-1.jpg
    alt: "…"
---

Body in Markdown.
```

It shows up automatically on its category page, in the menu and in the sitemap.

## Contact form

The site is static. Set `PUBLIC_FORM_ENDPOINT` (see `.env.example`) to a form backend, e.g. Formspree or Netlify Forms. Without it, the form falls back to a `mailto:` link.

## Not migrated yet — read before go-live

The blog, portfolio, sale (izpārdošana), fabric collection pages and the EN/RU versions still link to the old WordPress site at `https://lite.lv/...` (`legacy` in `src/data/site.ts`).
**If this site replaces WordPress at lite.lv, those links break.** Before cutover, either migrate those sections or move WordPress to e.g. `old.lite.lv` and update `legacy`.

PDFs and images that product texts link to (`/wp-content/uploads/...`) are copied into `public/`, so they keep working after cutover.

## Re-importing content

```sh
python3 -I scripts/scrape.py /tmp/lite-import   # then review and copy into src/content/
```
