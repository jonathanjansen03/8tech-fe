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
      include: [
        'src/api/**/*.js',
        'src/components/**/*.vue',
        'src/pages/**/*.vue',
        'src/stores/**/*.js',
        'src/utils/**/*.js',
      ],
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: 'src/__tests__/coverage',
    },
    environment: 'jsdom',
    include: ['src/__tests__/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    restoreMocks: true,
  },
});
