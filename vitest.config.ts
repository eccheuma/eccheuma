import { defineConfig } from 'vitest/dist/config.js';

import path from 'path';

export default defineConfig({
  test: {
    exclude: ['node_modules', 'source', 'utils', 'app', '.vscode', '.nuxt', '.firebase', '.github'],
    reporters: 'verbose',
    testTimeout: 12000,
    watch: false,
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './source')
    }
  },
  clearScreen: true,
  esbuild: {
    target: 'ES6'
  }
})