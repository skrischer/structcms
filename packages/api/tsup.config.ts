import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/next/index.ts', 'src/supabase/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
});
