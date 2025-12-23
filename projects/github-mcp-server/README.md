# GitHub MCP Server

MCP server for querying GitHub information in Cursor/Claude Code.

## Features

- Search repositories
- Get repository details
- List and view Issues
- List and view Pull Requests
- Search code
- Get file contents

## Installation

```bash
pnpm install
pnpm build
```

## Build System

This project uses [tsup](https://tsup.egoist.dev/) for building, which provides:

- Zero-config bundling with esbuild
- Automatic import path resolution (no need for .js extensions in source)
- Fast build times
- Source maps support

## Configuration

### Cursor MCP Configuration

Add to your Cursor MCP settings:

```json
{
  "mcpServers": {
    "github": {
      "command": "node",
      "args": ["/path/to/github-mcp-server/dist/index.js"],
      "env": {
        "GITHUB_TOKEN": "your_github_token_here"
      }
    }
  }
}
```

### GitHub Token

Create a GitHub Personal Access Token with the following scopes:

- `repo` (for private repositories)
- `read:org` (for organization data)
- `read:user` (for user data)

Set the token via environment variable:

```bash
export GITHUB_TOKEN=your_token_here
```

## Development

```bash
pnpm dev    # Watch mode with tsup
pnpm build  # Build with tsup
pnpm start  # Run the built server
```

## Available Tools

Currently implemented (Phase 1):

**Repositories**:

- `github_search_repos` - Search GitHub repositories
- `github_get_repo` - Get repository details

**Issues**:

- `github_list_issues` - List repository issues
- `github_get_issue` - Get issue details

**User & Profile**:

- `github_get_authenticated_user` - Get your GitHub profile information
- `github_list_user_repos` - List repositories for yourself or any user

Coming soon (Phase 2):

- `github_list_prs` - List pull requests
- `github_get_pr` - Get pull request details
- `github_search_code` - Search code in repositories
- `github_get_file` - Get file contents

## Quick Start

1. Install dependencies:

```bash
cd /Users/rufeng.wei/Study/heaven-study-repo/projects/github-mcp-server
pnpm install
```

2. Build the project:

```bash
pnpm build
```

3. Get a GitHub token from https://github.com/settings/tokens

4. Configure Cursor by copying `mcp-config.example.json` and updating the token

5. Restart Cursor to load the MCP server

## Usage Examples

Once configured in Cursor, you can ask Claude:

**Search & Explore**:

- "Search for React repositories on GitHub"
- "Show me details about facebook/react"

**Issues**:

- "List open issues in microsoft/vscode"
- "Get details of issue #12345 in owner/repo"

**Your Profile & Repos**:

- "Show me my GitHub profile"
- "How many repositories do I have?"
- "List all my repositories"
- "Show me my most recently updated repos"
- "List repositories for user torvalds"

## License

MIT
