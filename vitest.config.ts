import { defineConfig } from 'vitest/dist/config.js';

import path from 'path';

export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'json', 'html']
    }
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './source')
    }
  },
  clearScreen: true,
})