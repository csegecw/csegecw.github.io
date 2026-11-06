import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// csegecw.github.io is a user site, so it is served from the domain root.
// Two pages: the landing page, and /placement (GitHub Pages serves placement/index.html there).
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': resolve(import.meta.dirname, 'src') } },
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        placement: resolve(import.meta.dirname, 'placement/index.html'),
      },
    },
  },
});
