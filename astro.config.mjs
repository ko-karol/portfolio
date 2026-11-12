import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ko-karol.com',
  integrations: [sitemap()],
  prefetch: { defaultStrategy: 'hover' },
});
