// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://ronm.lol',
  base: '/',
  markdown: {
    remarkPlugins: [],
    shikiConfig: {
      theme: 'synthwave-84',
      langs: [],
      wrap: true,
    },
  },
});
