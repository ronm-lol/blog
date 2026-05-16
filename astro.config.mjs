// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://ronm.lol',
  base: '/',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'synthwave-84',
      langs: [],
      wrap: true,
    },
  },
});
