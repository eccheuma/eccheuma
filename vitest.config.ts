import { defineConfig } from 'vitest/dist/config.js';
import { config as configEnviroment } from 'dotenv';

import path from 'path';

configEnviroment();

export default defineConfig({
  test: {
    dir: 'spec',
    reporters: 'verbose',
    testTimeout: 12000,
    setupFiles: [
      './vitest.setup.ts'
    ],
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './source'),
      'path::root': path.resolve(__dirname, '.')
    }
  },
});