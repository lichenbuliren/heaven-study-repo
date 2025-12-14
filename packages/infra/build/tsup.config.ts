import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/configs/node-lib.ts', 'src/configs/react-lib.ts'],
  outDir: 'dist',
  format: ['esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
})
