import { defineConfig, Options } from 'tsup'

export const createConfig = (options: Options = {}) =>
  defineConfig({
    entry: ['src/index.ts'],
    outDir: 'dist',
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    sourcemap: true,
    splitting: false,
    treeshake: true,
    ...options,
  })
