import type { GitHubClient } from "../github/client";
import type { ListUserReposParams } from "../types";
import { formatDate } from "../utils/formatter";

export async function getAuthenticatedUser(
  client: GitHubClient
): Promise<string> {
  try {
    const { data } = await client.getClient().users.getAuthenticated();

    let result = `# ${data.login}\n\n`;

    if (data.name) {
      result += `**Name**: ${data.name}\n`;
    }

    if (data.bio) {
      result += `**Bio**: ${data.bio}\n\n`;
    }

    result += `**Public Repositories**: ${data.public_repos}\n`;
    result += `**Public Gists**: ${data.public_gists}\n`;
    result += `**Followers**: ${data.followers}\n`;
    result += `**Following**: ${data.following}\n`;

    if (data.company) {
      result += `**Company**: ${data.company}\n`;
    }

    if (data.location) {
      result += `**Location**: ${data.location}\n`;
    }

    if (data.blog) {
      result += `**Website**: ${data.blog}\n`;
    }

    if (data.twitter_username) {
      result += `**Twitter**: @${data.twitter_username}\n`;
    }

    result += `**Account Created**: ${formatDate(data.created_at)}\n`;
    result += `**Last Updated**: ${formatDate(data.updated_at)}\n\n`;
    result += `**Profile URL**: ${data.html_url}\n`;

    return result;
  } catch (error) {
    if (error instanceof Error && 'status' in error && error.status === 401) {
      return `❌ Error: Authentication required\n\nPlease ensure your GITHUB_TOKEN is valid and has the necessary permissions.`;
    }
    return `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

export async function listUserRepos(
  client: GitHubClient,
  params: ListUserReposParams
): Promise<string> {
  try {
    let data;

    if (params.username) {
      // List repos for a specific user
      const response = await client.getClient().repos.listForUser({
        username: params.username,
        type: params.type || 'owner',
        sort: params.sort || 'updated',
        direction: params.direction || 'desc',
        per_page: params.per_page || 10,
        page: params.page || 1,
      });
      data = response.data;
    } else {
      // List repos for authenticated user
      const response = await client.getClient().repos.listForAuthenticatedUser({
        type: params.type || 'owner',
        sort: params.sort || 'updated',
        direction: params.direction || 'desc',
        per_page: params.per_page || 10,
        page: params.page || 1,
      });
      data = response.data;
    }

    if (data.length === 0) {
      return `## No repositories found\n\n${params.username ? `User '${params.username}'` : 'You'} ${params.type === 'member' ? 'are not a member of' : 'do not own'} any repositories.`;
    }

    const userDisplay = params.username || 'Your';
    let result = `## ${userDisplay} Repositories (${data.length} shown)\n\n`;

    for (const repo of data) {
      result += `### ${repo.full_name}\n\n`;

      result += `⭐ ${repo.stargazers_count.toLocaleString()} | `;
      result += `🍴 ${repo.forks_count.toLocaleString()}`;

      if (repo.language) {
        result += ` | 💻 ${repo.language}`;
      }

      if (repo.private) {
        result += ` | 🔒 Private`;
      }

      result += '\n\n';

      if (repo.description) {
        result += `${repo.description}\n\n`;
      }

      if (repo.topics && repo.topics.length > 0) {
        result += `**Topics**: ${repo.topics.join(', ')}\n\n`;
      }

      result += `**Updated**: ${formatDate(repo.updated_at)}\n`;
      result += `**URL**: ${repo.html_url}\n\n`;
      result += '---\n\n';
    }

    return result;
  } catch (error) {
    if (error instanceof Error && 'status' in error && error.status === 404) {
      return `❌ Error: User not found\n\nThe user '${params.username}' does not exist.`;
    }
    if (error instanceof Error && 'status' in error && error.status === 401) {
      return `❌ Error: Authentication required\n\nPlease ensure your GITHUB_TOKEN is valid.`;
    }
    return `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}
