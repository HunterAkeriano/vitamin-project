import { defineConfig } from 'vite';
import injectHTML from 'vite-plugin-html-inject';
import pages from './pages.config.js';

const pagesInput = {};

pages.forEach((page) => {
  pagesInput[page.name] = page.path;
});

export default defineConfig({
  base: '/Vitamin',
  build: {
    target: 'es2022',
    outDir: 'build',
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        ...pagesInput,
      },
    },
  },

  server: {
    port: 3025,
    host: 'localhost',
    hmr: true,
  },

  plugins: [injectHTML()],
});
