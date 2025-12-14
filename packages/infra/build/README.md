# @heaven/infra-build

统一的构建工具配置，基于 tsup。

## 安装

```bash
pnpm add -D @heaven/infra-build
```

## 使用方式

### 方式 1: 使用预设配置（推荐）

```typescript
// tsup.config.ts
import { nodeLibConfig } from '@heaven/infra-build/node-lib'

export default nodeLibConfig
```

### 方式 2: 自定义配置

```typescript
// tsup.config.ts
import { defineConfig } from 'tsup'
import { nodeLibConfig } from '@heaven/infra-build/node-lib'

export default defineConfig({
  ...nodeLibConfig,
  entry: ['src/index.ts', 'src/cli.ts'], // 覆盖入口
})
```

### 方式 3: 使用基础配置

```typescript
// tsup.config.ts
import { createConfig } from '@heaven/infra-build'

export default createConfig({
  entry: ['src/index.ts'],
  platform: 'node',
})
```

## 预设配置

### node-lib

适用于 Node.js 库

```typescript
import { nodeLibConfig } from '@heaven/infra-build/node-lib'
```

**特性**:
- 输出 ESM + CJS
- 自动生成类型声明
- 排除 Node 内置模块
- Target: Node 18

### react-lib

适用于 React 组件库

```typescript
import { reactLibConfig } from '@heaven/infra-build/react-lib'
```

**特性**:
- 输出 ESM + CJS
- JSX 自动转换
- SVG 转 DataURL
- CSS 内联处理
- Target: ES2020

## 输出结构

```
dist/
├── index.js          # ESM 入口
├── index.cjs         # CJS 入口
├── index.d.ts        # 类型声明
└── index.d.cts       # CJS 类型声明
```

## package.json 配置

```json
{
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup"
  }
}
```

## 依赖管理

### tsup 的 external 规则

tsup 会自动处理依赖：

```json
{
  "dependencies": {
    "lodash": "^4.0.0"  // ✅ 自动 external（不打包）
  },
  "peerDependencies": {
    "react": "^18.0.0"  // ✅ 自动 external（不打包）
  },
  "devDependencies": {
    "typescript": "^5.0.0"  // ❌ 会打包（如果代码引用了）
  }
}
```

### 正确的依赖分类

**dependencies** - 运行时依赖
```json
{
  "dependencies": {
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "eslint-plugin-react": "^7.0.0"
  }
}
```
- 代码中 `import` 的第三方库
- 会被自动 external
- 用户安装你的包时会一起安装

**peerDependencies** - 宿主环境依赖
```json
{
  "peerDependencies": {
    "eslint": ">=9.0.0",
    "react": ">=18.0.0"
  }
}
```
- 用户环境必须提供的依赖
- 会被自动 external
- 用户需要自行安装

**devDependencies** - 开发依赖
```json
{
  "devDependencies": {
    "typescript": "^5.0.0",
    "tsup": "^8.0.0",
    "@heaven/infra-build": "workspace:*"
  }
}
```
- 仅构建时需要
- 不应该在运行时代码中 `import`
- 如果代码引用了会被打包（导致产物过大）

### ⚠️ 常见错误

```json
// ❌ 错误：运行时依赖放在 devDependencies
{
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^8.0.0"  // 会被打包！
  }
}

// ✅ 正确：运行时依赖放在 dependencies
{
  "dependencies": {
    "@typescript-eslint/eslint-plugin": "^8.0.0"  // 自动 external
  }
}
```

## 常见问题

### 如何排除特定依赖？

tsup 自动排除 `dependencies` 和 `peerDependencies`，无需手动配置。

### 构建产物过大怎么办？

检查依赖分类：
```bash
# 构建后检查产物大小
ls -lh dist/

# 如果过大（>100KB），检查是否有依赖被打包
# 将运行时依赖从 devDependencies 移到 dependencies
```

### 如何处理 SVG？

React 库预设已配置 SVG 转 DataURL。如需其他方式：

```typescript
import { reactLibConfig } from '@heaven/infra-build/react-lib'

export default {
  ...reactLibConfig,
  esbuildOptions(options) {
    options.loader = {
      ...options.loader,
      '.svg': 'file', // 输出文件
    }
  },
}
```

### 如何添加多入口？

```typescript
export default {
  ...nodeLibConfig,
  entry: {
    index: 'src/index.ts',
    cli: 'src/cli.ts',
  },
}
```
