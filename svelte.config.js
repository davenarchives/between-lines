import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      images: {
        sizes: [640, 750, 828, 1080, 1200],
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 60
      }
    })
  },
  preprocess: vitePreprocess()
};

export default config;
