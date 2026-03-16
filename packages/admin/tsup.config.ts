import { copyFileSync, mkdirSync } from 'node:fs';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  onSuccess: async () => {
    mkdirSync('dist/styles', { recursive: true });
    copyFileSync('src/styles/admin.css', 'dist/styles/admin.css');
  },
});
