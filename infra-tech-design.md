# Monorepo 基础设施架构设计

## 项目概述

基于 pnpm Workspaces + Turborepo 的 Monorepo 项目，提供统一的 TypeScript 配置、ESLint 配置和构建工具链。

## 技术栈

- **包管理**: pnpm Workspaces
- **构建编排**: Turborepo
- **语言**: TypeScript 5.x
- **发布**: Changesets + pnpm publish

## 目录结构

```
.
├── apps/                    # 应用层
│   └── todo-web/           # React 应用示例
├── packages/               # 共享包层
│   ├── typescript-config/  # TypeScript 配置包
│   ├── eslint-config/      # ESLint 配置包
│   ├── http-client/        # HTTP 客户端库
│   ├── utils/              # 公共工具库
│   └── infra/              # 基础设施工具
│       ├── build/          # 构建脚本
│       ├── cli/            # CLI 工具
│       └── publish/        # 发布脚本
└── global-shared/          # ❌ 待删除（违反最佳实践）
```

## 核心包设计

### 1. @heaven/typescript-config

**定位**: 纯配置文件包，提供多场景 TypeScript 配置

**配置类型**:
- `tsconfig.base.json` - 基础配置（ES2020, strict mode）
- `tsconfig.lib.json` - 通用库开发（输出 dist/）
- `tsconfig.react-lib.json` - React 组件库（JSX + DOM）
- `tsconfig.react.json` - React 应用（bundler 模式，noEmit）
- `tsconfig.nodejs.json` - Node.js 项目（Node types）

**package.json 关键配置**:
```json
{
  "name": "@heaven/typescript-config",
  "version": "1.0.0",
  "files": ["tsconfig.*.json"],
  "exports": {
    "./base": "./tsconfig.base.json",
    "./lib": "./tsconfig.lib.json",
    "./react": "./tsconfig.react.json",
    "./react-lib": "./tsconfig.react-lib.json",
    "./nodejs": "./tsconfig.nodejs.json",
    "./tsconfig.*.json": "./tsconfig.*.json"
  },
  "scripts": {
    "build": "echo 'No build needed for config package'"
  }
}
```

**使用方式**:
```json
{
  "extends": "@heaven/typescript-config/tsconfig.lib.json"
}
```

**设计要点**:
- ✅ 无需构建，直接发布源文件
- ✅ 通过 `exports` 通配符支持 TypeScript extends
- ✅ target: ES2020（现代浏览器标准）
- ✅ moduleResolution: node（库）/ bundler（应用）

### 2. @heaven/eslint-config

**定位**: ESLint 配置包，支持 TypeScript + React + Node.js

**package.json 关键配置**:
```json
{
  "name": "@heaven/eslint-config",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsc"
  },
  "peerDependencies": {
    "eslint": ">=9.0.0",
    "@typescript-eslint/eslint-plugin": ">=8.0.0",
    "eslint-plugin-react": ">=7.0.0",
    "eslint-plugin-n": ">=17.0.0"
  }
}
```

**tsconfig.json**:
```json
{
  "extends": "@heaven/typescript-config/tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "."
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

**设计要点**:
- ✅ 需要构建，输出到 dist/
- ✅ 使用 ESM 模块（type: "module"）
- ✅ 使用 `eslint-plugin-n` 替代已废弃的 `eslint-plugin-node`
- ✅ 类型断言处理插件兼容性（`as any`）

## 关键设计决策

### 1. 为什么不使用 global-shared 顶层目录？

**问题**:
- ❌ 无 package.json，无法声明依赖
- ❌ 不在 workspace 中，无法被 Turborepo 管理
- ❌ 无法独立版本化和发布
- ❌ TypeScript 路径别名脆弱

**解决方案**: 迁移到 `packages/shared` 或 `packages/utils`

### 2. 为什么 target 选择 ES2020 而不是 ES5？

**理由**:
- ✅ ES2020 在主流浏览器已全面支持（2020+）
- ✅ 包体积减少 20-30%
- ✅ 原生特性性能优于 polyfill
- ✅ 现代构建工具会根据 browserslist 自动降级

**兼容性处理**: 在构建工具（Vite/Rollup）配置 target，而非 tsconfig

### 3. 为什么 moduleResolution 使用 node 而不是 bundler？

**场景区分**:
- **库（lib/react-lib/nodejs）**: 使用 `node`
  - 输出构建产物供外部使用
  - 确保类型声明路径正确
  - 兼容非打包工具环境

- **应用（react）**: 使用 `bundler`
  - 由 Vite 等工具处理
  - 支持省略扩展名
  - noEmit: true

### 4. Monorepo 中为什么不用 main 指向源码？

**原因**:
- ❌ TypeScript 不会自动解析 .ts 文件
- ❌ Node.js 和打包工具默认查找 .js
- ✅ Turborepo 通过 `dependsOn: ["^build"]` 管理构建顺序

**工作流**:
```bash
pnpm build  # Turborepo 自动按依赖顺序构建
pnpm dev    # 应用引用构建后的 dist/
```

### 5. 为什么 tsconfig extends 使用包名而不是相对路径？

**TypeScript 限制**: extends 不支持 `exports` 字段的子路径

**解决方案**: 在 package.json 添加通配符导出
```json
{
  "exports": {
    "./tsconfig.*.json": "./tsconfig.*.json"
  }
}
```

**效果**:
- ✅ 使用包名：`@heaven/typescript-config/tsconfig.lib.json`
- ✅ 符合 Monorepo 规范
- ✅ 发布后正常工作

## 构建与发布策略

### 包类型分类

1. **配置包**（typescript-config）
   - 无需构建
   - 直接发布源文件
   - build 脚本仅占位

2. **代码包**（eslint-config, utils, http-client）
   - 需要 TypeScript 编译
   - 输出到 dist/
   - 后续统一使用 `@heaven/infra-build` 提供构建配置

### Turborepo Pipeline

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"]
    }
  }
}
```

### 发布流程

```bash
# 1. 构建所有包
pnpm build

# 2. 使用 Changesets 管理版本
pnpm changeset

# 3. 发布到 npm
pnpm publish -r
```

## 依赖管理原则

### workspace 协议

```json
{
  "devDependencies": {
    "@heaven/typescript-config": "workspace:*",
    "@heaven/eslint-config": "workspace:*"
  }
}
```

### peerDependencies 策略

- 配置包：声明 TypeScript/ESLint 版本要求
- 工具包：声明必需的运行时依赖
- 使用范围版本（`>=9.0.0`）保证兼容性

## 未来规划

### packages/infra 结构

```
packages/infra/
├── build/
│   ├── package.json
│   ├── rollup.config.js    # Rollup 配置
│   └── tsup.config.js      # tsup 配置
├── cli/
│   ├── package.json
│   └── src/                # CLI 工具
└── publish/
    ├── package.json
    └── scripts/            # 发布脚本
```

### 待实现功能

- [ ] 统一构建工具 `@heaven/infra-build`
- [ ] CLI 工具 `@heaven/cli`
- [ ] 自动化发布脚本
- [ ] CI/CD 流水线配置
- [ ] 删除 global-shared 目录
- [ ] 实现 http-client 包
- [ ] 实现 utils 包

## 最佳实践总结

1. ✅ 所有可复用代码必须是正规的 workspace 包
2. ✅ 配置包直接发布源文件，代码包构建后发布
3. ✅ 使用 workspace:* 引用内部包
4. ✅ tsconfig extends 使用包名 + 通配符导出
5. ✅ 库使用 moduleResolution: node，应用使用 bundler
6. ✅ target: ES2020，兼容性由构建工具处理
7. ✅ 通过 Turborepo 管理构建依赖顺序
8. ✅ 使用 Changesets 管理版本和发布

## 参考资料

- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Turborepo](https://turbo.build/repo/docs)
- [TypeScript Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)
- [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files)
