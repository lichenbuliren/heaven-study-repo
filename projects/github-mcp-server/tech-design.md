# GitHub MCP Server 技术设计文档

## 1. 项目概述

### 1.1 目标
创建一个 MCP (Model Context Protocol) 服务器，使 Cursor 中的 AI 能够查询 GitHub 信息，包括仓库、Issue、PR、代码搜索等功能。

### 1.2 核心价值
- 在编码过程中快速获取 GitHub 上的项目信息
- 无需离开编辑器即可查看 Issue/PR 状态
- 辅助代码审查和项目管理
- 提升开发效率

## 2. 技术架构

### 2.1 技术栈
- **语言**: TypeScript/Node.js
- **MCP SDK**: `@modelcontextprotocol/sdk` (v1.0.4+)
- **GitHub API**: `@octokit/rest` (v21.0.2+)
- **传输协议**: stdio (标准输入输出)

### 2.2 架构设计

```
┌─────────────────────┐
│  Cursor/Claude Code │
└──────────┬──────────┘
           │ stdio
           ↓
┌─────────────────────┐
│   MCP Server        │
│  ┌───────────────┐  │
│  │ Server Core   │  │
│  ├───────────────┤  │
│  │ Tool Registry │  │
│  ├───────────────┤  │
│  │ GitHub Client │  │
│  └───────────────┘  │
└──────────┬──────────┘
           │ HTTPS
           ↓
┌─────────────────────┐
│   GitHub REST API   │
└─────────────────────┘
```

### 2.3 模块划分

```
src/
├── index.ts           # 入口文件，初始化 MCP 服务器
├── server.ts          # MCP 服务器核心逻辑
├── tools/             # 工具实现
│   ├── repos.ts       # 仓库相关工具
│   ├── issues.ts      # Issue 相关工具
│   ├── prs.ts         # PR 相关工具
│   └── search.ts      # 搜索相关工具
├── github/            # GitHub API 封装
│   └── client.ts      # Octokit 客户端封装
├── types/             # TypeScript 类型定义
│   └── index.ts
└── utils/             # 工具函数
    ├── formatter.ts   # 格式化输出
    └── validator.ts   # 参数验证
```

## 3. 功能设计

### 3.1 核心工具 (P0 优先级)

#### 3.1.1 github_search_repos
搜索 GitHub 仓库

**参数**:
```typescript
{
  query: string;          // 搜索关键词
  sort?: 'stars' | 'forks' | 'updated';
  order?: 'asc' | 'desc';
  per_page?: number;      // 默认 10，最大 100
  page?: number;          // 默认 1
}
```

**返回**: 仓库列表（Markdown 格式）

#### 3.1.2 github_get_repo
获取仓库详细信息

**参数**:
```typescript
{
  owner: string;          // 仓库所有者
  repo: string;           // 仓库名
}
```

**返回**: 仓库详情（包括 stars, forks, description, topics 等）

#### 3.1.3 github_list_issues
列出仓库的 Issues

**参数**:
```typescript
{
  owner: string;
  repo: string;
  state?: 'open' | 'closed' | 'all';  // 默认 'open'
  labels?: string;        // 逗号分隔的标签
  per_page?: number;      // 默认 10
  page?: number;
}
```

#### 3.1.4 github_get_issue
获取 Issue 详情

**参数**:
```typescript
{
  owner: string;
  repo: string;
  issue_number: number;
}
```

**返回**: Issue 详情（包括标题、正文、评论数、标签等）

#### 3.1.5 github_list_prs
列出 Pull Requests

**参数**:
```typescript
{
  owner: string;
  repo: string;
  state?: 'open' | 'closed' | 'all';
  per_page?: number;
  page?: number;
}
```

#### 3.1.6 github_get_pr
获取 PR 详情

**参数**:
```typescript
{
  owner: string;
  repo: string;
  pull_number: number;
}
```

### 3.2 扩展工具 (P1 优先级)

- `github_search_code` - 代码搜索
- `github_get_file` - 获取文件内容
- `github_list_commits` - 列出提交记录
- `github_get_commit` - 获取提交详情

### 3.3 高级工具 (P2 优先级)

- `github_create_issue` - 创建 Issue
- `github_comment_issue` - 评论 Issue
- `github_list_releases` - 列出发布版本

## 4. 认证方案

### 4.1 Token 管理
支持三种方式（优先级从高到低）：

1. **环境变量**: `GITHUB_TOKEN`（推荐）
2. **配置文件**: `~/.github-mcp/config.json`
3. **MCP 配置**: 通过 Cursor 的 MCP 配置传递

### 4.2 权限要求
- **公开仓库查询**: 无需 token（但有速率限制）
- **私有仓库/写操作**: 需要 Personal Access Token
- **推荐权限**: `repo`, `read:org`, `read:user`

### 4.3 速率限制
- 未认证: 60 请求/小时
- 已认证: 5000 请求/小时
- 实现策略: 请求缓存 + 重试机制

## 5. 数据格式化

### 5.1 输出格式
所有工具返回 Markdown 格式，便于 AI 理解和用户阅读。

**示例 - 仓库信息**:
```markdown
# facebook/react

⭐ 234,567 | 🍴 45,678 | 📝 MIT License

A declarative, efficient, and flexible JavaScript library for building user interfaces.

**Topics**: javascript, react, frontend, ui

**Homepage**: https://react.dev
**Created**: 2013-05-24
**Last Updated**: 2025-12-23
```

**示例 - Issue 列表**:
```markdown
## Open Issues (10)

### #12345 - Bug: Memory leak in useEffect
👤 @username | 🏷️ bug, priority-high | 💬 5 comments
Created: 2025-12-20

Memory leak occurs when using useEffect with dependencies...

---

### #12344 - Feature: Add dark mode support
👤 @username | 🏷️ enhancement | 💬 12 comments
Created: 2025-12-19

Would be great to have built-in dark mode support...
```

### 5.2 错误处理
统一的错误格式：
```markdown
❌ Error: Repository not found

The repository 'owner/repo' does not exist or you don't have access to it.

Suggestions:
- Check the repository name spelling
- Ensure you have access permissions
- Verify your GitHub token is valid
```

## 6. 实现计划

### Phase 1: 基础框架 (1-2天)
- [x] 项目初始化
- [ ] MCP SDK 集成
- [ ] stdio 传输层实现
- [ ] GitHub Octokit 客户端封装
- [ ] 基础错误处理

### Phase 2: 核心功能 (2-3天)
- [ ] 实现 6 个 P0 工具
- [ ] 参数验证
- [ ] Markdown 格式化
- [ ] 速率限制处理
- [ ] 缓存机制

### Phase 3: 测试与优化 (1-2天)
- [ ] 单元测试
- [ ] Cursor 集成测试
- [ ] 错误处理优化
- [ ] 性能优化

### Phase 4: 扩展功能 (可选)
- [ ] P1/P2 工具实现
- [ ] GraphQL API 支持
- [ ] 配置文件支持

## 7. 配置示例

### 7.1 Cursor MCP 配置
位置: `~/.cursor/mcp_settings.json` 或项目 `.cursor/mcp_settings.json`

```json
{
  "mcpServers": {
    "github": {
      "command": "node",
      "args": [
        "/Users/rufeng.wei/Study/heaven-study-repo/projects/github-mcp-server/dist/index.js"
      ],
      "env": {
        "GITHUB_TOKEN": "ghp_xxxxxxxxxxxxxxxxxxxx"
      }
    }
  }
}
```

### 7.2 环境变量配置
```bash
# .env 或 .bashrc/.zshrc
export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```

## 8. 安全考虑

### 8.1 Token 安全
- ✅ 使用环境变量存储 token
- ✅ 添加 `.gitignore` 防止泄露
- ✅ 不在日志中输出 token
- ❌ 不在代码中硬编码 token

### 8.2 输入验证
- 验证所有用户输入参数
- 防止注入攻击
- 限制返回数据大小（避免超大响应）

### 8.3 速率限制
- 实现请求缓存（5 分钟）
- 添加重试机制（指数退避）
- 监控 API 配额使用情况

## 9. 性能优化

### 9.1 缓存策略
- 仓库信息: 缓存 5 分钟
- Issue/PR 列表: 缓存 2 分钟
- 搜索结果: 缓存 5 分钟

### 9.2 并发控制
- 最大并发请求: 5
- 请求超时: 30 秒
- 队列管理: FIFO

### 9.3 数据截断
- Issue/PR 正文: 最多 2000 字符
- 评论列表: 最多显示 10 条
- 搜索结果: 默认 10 条，最多 100 条

## 10. 测试策略

### 10.1 单元测试
- 工具参数验证
- GitHub API 调用
- 格式化输出
- 错误处理

### 10.2 集成测试
- MCP 协议通信
- Cursor 集成
- 端到端流程

### 10.3 测试用例
```typescript
// 示例测试用例
describe('github_search_repos', () => {
  it('should search repositories with query', async () => {
    const result = await searchRepos({ query: 'react' });
    expect(result).toContain('facebook/react');
  });

  it('should handle invalid query', async () => {
    const result = await searchRepos({ query: '' });
    expect(result).toContain('Error');
  });
});
```

## 11. 后续扩展

### 11.1 短期目标
- 支持 GitHub GraphQL API（更高效）
- 添加本地缓存（SQLite）
- 支持批量操作

### 11.2 长期目标
- 支持 GitHub Enterprise
- 添加 GitLab/Bitbucket 支持
- Webhook 实时更新
- 统计分析功能

## 12. 参考资料

- [MCP 官方文档](https://modelcontextprotocol.io)
- [GitHub REST API](https://docs.github.com/en/rest)
- [Octokit.js](https://github.com/octokit/octokit.js)
- [Cursor MCP 配置](https://docs.cursor.com/mcp)

## 13. 预估工作量

- **核心功能**: 3-5 天
- **完整版本**: 1-2 周
- **维护成本**: 低（API 稳定）

## 14. 风险评估

| 风险 | 影响 | 概率 | 缓解措施 |
|------|------|------|----------|
| GitHub API 速率限制 | 高 | 中 | 实现缓存和重试机制 |
| Token 泄露 | 高 | 低 | 使用环境变量，添加安全检查 |
| MCP 协议变更 | 中 | 低 | 关注 SDK 更新，及时适配 |
| 大数据量响应 | 中 | 中 | 实现数据截断和分页 |

---

**文档版本**: v1.0
**创建日期**: 2025-12-24
**最后更新**: 2025-12-24
**作者**: Claude Code
