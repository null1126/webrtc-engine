import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs', 'iife'],
  globalName: 'WebRTCEnginePluginPerformance',
  dts: true,
  sourcemap: false,
  clean: true,
  minify: false,
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
