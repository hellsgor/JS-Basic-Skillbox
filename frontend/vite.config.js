import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  css: {
    devSourcemap: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '@api': resolve(__dirname, 'src/api'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@fonts': resolve(__dirname, '/fonts'),
      '@components': resolve(__dirname, 'src/components'),
    },
  },
});
