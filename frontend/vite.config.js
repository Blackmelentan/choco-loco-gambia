import { defineConfig } from 'vite';

export default defineConfig({
  // Relative base URL for seamless GitHub Pages deployment
  base: './',
  server: {
    port: 5173,
    host: true,
    open: true
  },
  // Serve public/assets statically
  publicDir: 'public'
});

