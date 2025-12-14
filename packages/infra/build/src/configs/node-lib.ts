import { defineConfig } from 'tsup'

export const nodeLibConfig = defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  platform: 'node',
  target: 'node18',
  external: [/^node:/],
})
