import { resolve } from 'node:path';
import { config as dotenvConfig } from 'dotenv';
import { defineConfig } from 'vitest/config';

// Load .env from workspace root
dotenvConfig({ path: resolve(__dirname, '../../.env') });

export default defineConfig({
  test: {
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
