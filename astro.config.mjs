// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://lite.lv',
  // WordPress URLs end with a slash; keep them identical for SEO.
  trailingSlash: 'always',
  integrations: [sitemap()],
  i18n: {
    defaultLocale: 'lv',
    locales: ['lv', 'en', 'ru'],
    routing: { prefixDefaultLocale: false },
  },
  redirects: {
    '/par-mums/': '/home-lat/par-mums/',
    '/produkcija/': '/produkti/',
  },
  image: {
    layout: 'constrained',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
