import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  css: {
    devSourcemap: true,
  },
  resolve: {
    alias: {
      '@api': resolve(__dirname, 'src/api'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@fonts': resolve(__dirname, 'public/fonts'),
      '@components': resolve(__dirname, 'src/components'),
    },
  },
});
