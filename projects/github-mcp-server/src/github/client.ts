import { Octokit } from "@octokit/rest";
import type { GitHubConfig } from "../types";

export class GitHubClient {
  private octokit: Octokit;

  constructor(config: GitHubConfig = {}) {
    const token = config.token || process.env.GITHUB_TOKEN;

    this.octokit = new Octokit({
      auth: token,
      userAgent: "github-mcp-server/0.1.0",
    });
  }

  getClient(): Octokit {
    return this.octokit;
  }

  async checkRateLimit(): Promise<{
    remaining: number;
    limit: number;
    reset: Date;
  }> {
    const { data } = await this.octokit.rateLimit.get();
    return {
      remaining: data.rate.remaining,
      limit: data.rate.limit,
      reset: new Date(data.rate.reset * 1000),
    };
  }
}
