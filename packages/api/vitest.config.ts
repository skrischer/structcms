import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import { config as dotenvConfig } from 'dotenv';

// Load .env from workspace root
dotenvConfig({ path: resolve(__dirname, '../../.env') });

export default defineConfig({
  test: {
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
