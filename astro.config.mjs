// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://ronm.lol',
  base: '/',
  markdown: {
    shikiConfig: {
      theme: 'synthwave-84',
      langs: [],
      wrap: true,
    },
  },
});
