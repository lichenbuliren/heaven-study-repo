import { defineConfig } from 'tsup';

// src/configs/node-lib.ts
var nodeLibConfig = defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  platform: "node",
  target: "node18",
  external: [/^node:/]
});

export { nodeLibConfig };
//# sourceMappingURL=node-lib.js.map
//# sourceMappingURL=node-lib.js.map