import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { GitHubClient } from "./github/client";
import { searchRepos, getRepo } from "./tools/repos";
import { listIssues, getIssue } from "./tools/issues";
import { getAuthenticatedUser, listUserRepos } from "./tools/user";
import type {
  SearchReposParams,
  GetRepoParams,
  ListIssuesParams,
  GetIssueParams,
  ListUserReposParams,
} from "./types";

export class GitHubMCPServer {
  private server: Server;
  private githubClient: GitHubClient;

  constructor() {
    this.server = new Server(
      {
        name: "github-mcp-server",
        version: "0.1.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.githubClient = new GitHubClient();
    this.setupHandlers();
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "github_search_repos",
          description: "Search for GitHub repositories",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Search query",
              },
              sort: {
                type: "string",
                enum: ["stars", "forks", "updated"],
                description: "Sort field",
              },
              order: {
                type: "string",
                enum: ["asc", "desc"],
                description: "Sort order",
              },
              per_page: {
                type: "number",
                description: "Results per page (default: 10, max: 100)",
              },
              page: {
                type: "number",
                description: "Page number (default: 1)",
              },
            },
            required: ["query"],
          },
        },
        {
          name: "github_get_repo",
          description: "Get detailed information about a GitHub repository",
          inputSchema: {
            type: "object",
            properties: {
              owner: {
                type: "string",
                description: "Repository owner",
              },
              repo: {
                type: "string",
                description: "Repository name",
              },
            },
            required: ["owner", "repo"],
          },
        },
        {
          name: "github_list_issues",
          description: "List issues in a GitHub repository",
          inputSchema: {
            type: "object",
            properties: {
              owner: {
                type: "string",
                description: "Repository owner",
              },
              repo: {
                type: "string",
                description: "Repository name",
              },
              state: {
                type: "string",
                enum: ["open", "closed", "all"],
                description: "Issue state (default: open)",
              },
              labels: {
                type: "string",
                description: "Comma-separated list of labels",
              },
              per_page: {
                type: "number",
                description: "Results per page (default: 10)",
              },
              page: {
                type: "number",
                description: "Page number (default: 1)",
              },
            },
            required: ["owner", "repo"],
          },
        },
        {
          name: "github_get_issue",
          description: "Get detailed information about a specific issue",
          inputSchema: {
            type: "object",
            properties: {
              owner: {
                type: "string",
                description: "Repository owner",
              },
              repo: {
                type: "string",
                description: "Repository name",
              },
              issue_number: {
                type: "number",
                description: "Issue number",
              },
            },
            required: ["owner", "repo", "issue_number"],
          },
        },
        {
          name: "github_get_authenticated_user",
          description: "Get information about the authenticated user (yourself)",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "github_list_user_repos",
          description: "List repositories for a user or the authenticated user",
          inputSchema: {
            type: "object",
            properties: {
              username: {
                type: "string",
                description: "GitHub username (optional, defaults to authenticated user)",
              },
              type: {
                type: "string",
                enum: ["all", "owner", "member"],
                description: "Repository type (default: owner)",
              },
              sort: {
                type: "string",
                enum: ["created", "updated", "pushed", "full_name"],
                description: "Sort field (default: updated)",
              },
              direction: {
                type: "string",
                enum: ["asc", "desc"],
                description: "Sort direction (default: desc)",
              },
              per_page: {
                type: "number",
                description: "Results per page (default: 10)",
              },
              page: {
                type: "number",
                description: "Page number (default: 1)",
              },
            },
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;

        switch (name) {
          case "github_search_repos": {
            const result = await searchRepos(
              this.githubClient,
              args as unknown as SearchReposParams
            );
            return {
              content: [{ type: "text", text: result }],
            };
          }

          case "github_get_repo": {
            const result = await getRepo(
              this.githubClient,
              args as unknown as GetRepoParams
            );
            return {
              content: [{ type: "text", text: result }],
            };
          }

          case "github_list_issues": {
            const result = await listIssues(
              this.githubClient,
              args as unknown as ListIssuesParams
            );
            return {
              content: [{ type: "text", text: result }],
            };
          }

          case "github_get_issue": {
            const result = await getIssue(
              this.githubClient,
              args as unknown as GetIssueParams
            );
            return {
              content: [{ type: "text", text: result }],
            };
          }

          case "github_get_authenticated_user": {
            const result = await getAuthenticatedUser(this.githubClient);
            return {
              content: [{ type: "text", text: result }],
            };
          }

          case "github_list_user_repos": {
            const result = await listUserRepos(
              this.githubClient,
              args as unknown as ListUserReposParams
            );
            return {
              content: [{ type: "text", text: result }],
            };
          }

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        return {
          content: [{ type: "text", text: `❌ Error: ${errorMessage}` }],
          isError: true,
        };
      }
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    // eslint-disable-next-line no-console
    console.error("GitHub MCP Server running on stdio");
  }
}
