import { defineConfig } from 'tsup';

// src/configs/react-lib.ts
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

export { reactLibConfig };
//# sourceMappingURL=react-lib.js.map
//# sourceMappingURL=react-lib.js.map