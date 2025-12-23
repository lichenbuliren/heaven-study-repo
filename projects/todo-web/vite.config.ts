import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@todo-web": resolve(__dirname, "./src"),
      // 支持 monorepo 跨应用引用（示例）
      "@global-shared": resolve(__dirname, "../../global-shared"),
    },
  },
  build: {
    // 输出到 Monorepo 根目录的 dist/todo-web
    outDir: "./dist",
    emptyOutDir: true, // 构建前清空目录
    sourcemap: true, // 生成 sourcemap（调试用）
    rollupOptions: {
      output: {
        // 按需分割代码块
        manualChunks: {
          react: ["react", "react-dom"],
        },
      },
    },
    // 生产环境开启压缩
    minify: process.env.NODE_ENV === "production",
  },
});
