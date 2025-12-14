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
var reactLibConfig = defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: true,
  treeshake: true,
  platform: "browser",
  target: "es2020",
  esbuildOptions(options) {
    options.jsx = "automatic";
    options.loader = {
      ...options.loader,
      ".svg": "dataurl",
      ".css": "css"
    };
  }
});
var createConfig = (options = {}) => defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
  treeshake: true,
  ...options
});

export { createConfig, nodeLibConfig, reactLibConfig };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map