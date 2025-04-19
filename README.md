# Monorepo 仓库开发实践

结合 AI 工具快速搭建 Monorepo 仓库

## 目录设计

```bash
.
├── README.md
├── apps // 应用目录
│   ├── nodejs // nodejs 相关应用
│   ├── rn // React Native 相关应用
│   └── web // web 相关应用
└── packages
    ├── eslint-config // eslint config 配置
    ├── http-client // 网络请求库
    ├── infra // 基建相关目录，比如 cli，rollup 构建脚本，npm 发包脚本，CI 流水线
    ├── typescript-config // typescript config 配置，适配不同类型的项目
    └── utils // 公共工具包
```

## Monorepo 技术选型

采用 ​pnpm Workspaces + Turborepo 组合来维护项目

### 初始化 package.json

```bash
pnpm init
```

### 创建 pnpm workspaces 文件

```bash
touch pnpm-workspace.yaml
```

添加 workspace 目录配置

```bash
packages:
  - "apps/*"
  - "packages/*"
```

### Turborepo 配置

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/​**​", "apps/*/dist/​**​"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    }
  }
}
```

### git ignore 配置

基于业界通用配置：https://help.github.com/articles/ignoring-files/

```
touch .gitignore
```

## 常用命令

```bash
# 安装所有依赖（自动提升公共依赖）
pnpm install

# 递归运行所有子项目的 build 脚本
pnpm run build -r

# 仅构建受影响的包（Turborepo 增量构建）
turbo run build --filter=...

# 查看所有 workspace 包
pnpm workspace list

# 清理 Turbo 缓存
npx turbo prune
```
