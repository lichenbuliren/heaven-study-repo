// 共享 vitest.base.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    },
    environmentMatchGlobs: [
      ['**/*.test.tsx', 'jsdom'], // React 组件测试
      ['**/*.node.test.ts', 'node'] // Node 测试
    ]
  }
})