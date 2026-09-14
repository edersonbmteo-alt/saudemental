import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  // Support GitHub Pages (/saudemental/) or configurable via VITE_BASE_PATH.
  // Defaults to './' so built static assets are always linked relatively and never 404.
  const base = process.env.VITE_BASE_PATH || (process.env.GITHUB_PAGES === 'true' ? '/saudemental/' : './');

  return {
    base,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
