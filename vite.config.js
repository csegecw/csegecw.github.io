import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// csegecw.github.io is a user site, so it is served from the domain root.
// Two pages: the landing page, and /execom/call (GitHub Pages serves execom/call/index.html there).
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        execomCall: resolve(import.meta.dirname, 'execom/call/index.html'),
      },
    },
  },
});
