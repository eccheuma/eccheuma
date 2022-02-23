import { defineConfig } from 'vitest/dist/config.js';

import path from 'path';

export default defineConfig({
  test: {
    exclude: ['node_modules', 'source', 'utils', '.vscode', '.nuxt', '.firebase', '.github'],
    reporters: 'verbose',
    watch: false,
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './source')
    }
  },
  clearScreen: true,
})