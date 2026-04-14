import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs', 'iife'],
  globalName: 'WebRTCEngine',
  dts: true,
  sourcemap: false,
  clean: true,
  minify: true,
  treeshake: true,
  outExtension({ format }) {
    if (format === 'iife') {
      return { js: '.iife.js' };
    }

    return {
      js: format === 'cjs' ? '.cjs' : '.mjs',
    };
  },
});
