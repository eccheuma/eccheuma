import { defineConfig } from 'vitest/dist/config.js';

import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './source')
    }
  },
  clearScreen: true,
})