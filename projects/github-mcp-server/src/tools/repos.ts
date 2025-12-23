import type { GitHubClient } from "../github/client";
import type { SearchReposParams, GetRepoParams } from "../types";
import { formatDate } from "../utils/formatter";

export async function searchRepos(
  client: GitHubClient,
  params: SearchReposParams
): Promise<string> {
  try {
    const { data } = await client.getClient().search.repos({
      q: params.query,
      sort: params.sort,
      order: params.order,
      per_page: params.per_page || 10,
      page: params.page || 1,
    });

    if (data.items.length === 0) {
      return "## No repositories found\n\nTry adjusting your search query.";
    }

    let result = `## Search Results (${data.total_count} total)\n\n`;

    for (const repo of data.items) {
      result += `### ${repo.full_name}\n\n`;
      result += `⭐ ${repo.stargazers_count.toLocaleString()} | `;
      result += `🍴 ${repo.forks_count.toLocaleString()}`;
      if (repo.license) {
        result += ` | 📝 ${repo.license.name}`;
      }
      result += "\n\n";

      if (repo.description) {
        result += `${repo.description}\n\n`;
      }

      if (repo.topics && repo.topics.length > 0) {
        result += `**Topics**: ${repo.topics.join(", ")}\n\n`;
      }

      result += `**URL**: ${repo.html_url}\n`;
      result += `**Updated**: ${formatDate(repo.updated_at)}\n\n`;
      result += "---\n\n";
    }

    return result;
  } catch (error) {
    return `❌ Error: ${
      error instanceof Error ? error.message : "Unknown error"
    }`;
  }
}

export async function getRepo(
  client: GitHubClient,
  params: GetRepoParams
): Promise<string> {
  try {
    const { data } = await client.getClient().repos.get({
      owner: params.owner,
      repo: params.repo,
    });

    let result = `# ${data.full_name}\n\n`;
    result += `⭐ ${data.stargazers_count.toLocaleString()} | `;
    result += `🍴 ${data.forks_count.toLocaleString()} | `;
    result += `👀 ${data.watchers_count.toLocaleString()} watchers`;
    if (data.license) {
      result += ` | 📝 ${data.license.name}`;
    }
    result += "\n\n";

    if (data.description) {
      result += `${data.description}\n\n`;
    }

    if (data.topics && data.topics.length > 0) {
      result += `**Topics**: ${data.topics.join(", ")}\n\n`;
    }

    if (data.homepage) {
      result += `**Homepage**: ${data.homepage}\n`;
    }

    result += `**Language**: ${data.language || "N/A"}\n`;
    result += `**Created**: ${formatDate(data.created_at)}\n`;
    result += `**Last Updated**: ${formatDate(data.updated_at)}\n`;
    result += `**Open Issues**: ${data.open_issues_count}\n\n`;
    result += `**URL**: ${data.html_url}\n`;

    return result;
  } catch (error) {
    if (error instanceof Error && "status" in error && error.status === 404) {
      return `❌ Error: Repository not found\n\nThe repository '${params.owner}/${params.repo}' does not exist or you don't have access to it.`;
    }
    return `❌ Error: ${
      error instanceof Error ? error.message : "Unknown error"
    }`;
  }
}
