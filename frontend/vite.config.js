import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  css: {
    devSourcemap: true,
  },
  resolve: {
    alias: {
      '@styles': resolve(__dirname, 'src/styles'),
      '@fonts': resolve(__dirname, 'public/fonts'),
    },
  },
});
