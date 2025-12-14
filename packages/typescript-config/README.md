提供多种配置，用来支持不同的项目场景

# 配置说明

1. tsconfig.base.json - 基础配置

   - 严格模式、ES2020 目标
   - 包含 declaration、sourceMap 等通用选项

2. tsconfig.lib.json - 通用库开发

   - 适用于纯 TS 工具库
   - 输出 CommonJS/ESM，包含类型声明

3. tsconfig.react-lib.json - React 组件库

   - 支持 JSX (react-jsx)
   - 包含 DOM 类型
   - 排除测试和 stories 文件

4. tsconfig.react.json - React 应用

   - 使用 bundler 模式解析
   - noEmit: true (由 Vite 处理构建)
   - 支持 .ts 扩展名导入

5. tsconfig.nodejs.json - Node.js 项目

   - Node 类型支持
   - 适合 CLI 工具、后端服务

使用方式

```json
{
  "extends": "@heaven/typescript-config/react-lib"
}
// or
{
  "extends": "@heaven/typescript-config/nodejs"
}
```
