// @ts-check
import { defineConfig } from 'astro/config';
import { remarkZwsp } from './src/plugins/remark-zwsp.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://ronm.lol',
  base: '/',
  markdown: {
    remarkPlugins: [remarkZwsp],
    shikiConfig: {
      theme: 'synthwave-84',
      langs: [],
      wrap: true,
    },
  },
});
