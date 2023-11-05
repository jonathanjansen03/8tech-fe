import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    coverage: {
      exclude: ['<template>'],
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
    },
    environment: 'jsdom',
    globals: true,
    restoreMocks: true,
  },
});
