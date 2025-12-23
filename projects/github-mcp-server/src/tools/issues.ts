import type { GitHubClient } from "../github/client";
import type { ListIssuesParams, GetIssueParams } from "../types";
import { formatDate, truncate } from "../utils/formatter";

export async function listIssues(
  client: GitHubClient,
  params: ListIssuesParams
): Promise<string> {
  try {
    const { data } = await client.getClient().issues.listForRepo({
      owner: params.owner,
      repo: params.repo,
      state: params.state || "open",
      labels: params.labels,
      per_page: params.per_page || 10,
      page: params.page || 1,
    });

    if (data.length === 0) {
      return `## No ${
        params.state || "open"
      } issues found\n\nThis repository has no ${
        params.state || "open"
      } issues.`;
    }

    let result = `## ${params.state || "open"} Issues (${data.length})\n\n`;

    for (const issue of data) {
      // Skip pull requests
      if (issue.pull_request) continue;

      result += `### #${issue.number} - ${issue.title}\n\n`;
      result += `👤 @${issue.user?.login || "unknown"}`;

      if (issue.labels.length > 0) {
        const labels = issue.labels
          .map((l) => (typeof l === "string" ? l : l.name))
          .filter(Boolean)
          .join(", ");
        result += ` | 🏷️ ${labels}`;
      }

      result += ` | 💬 ${issue.comments} comments\n`;
      result += `**Created**: ${formatDate(issue.created_at)}\n\n`;

      if (issue.body) {
        result += `${truncate(issue.body, 200)}\n\n`;
      }

      result += `**URL**: ${issue.html_url}\n\n`;
      result += "---\n\n";
    }

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

export async function getIssue(
  client: GitHubClient,
  params: GetIssueParams
): Promise<string> {
  try {
    const { data } = await client.getClient().issues.get({
      owner: params.owner,
      repo: params.repo,
      issue_number: params.issue_number,
    });

    let result = `# #${data.number} - ${data.title}\n\n`;
    result += `**Repository**: ${params.owner}/${params.repo}\n`;
    result += `**Author**: @${data.user?.login || "unknown"}\n`;
    result += `**State**: ${data.state}\n`;

    if (data.labels.length > 0) {
      const labels = data.labels
        .map((l) => (typeof l === "string" ? l : l.name))
        .filter(Boolean)
        .join(", ");
      result += `**Labels**: ${labels}\n`;
    }

    result += `**Comments**: ${data.comments}\n`;
    result += `**Created**: ${formatDate(data.created_at)}\n`;
    result += `**Updated**: ${formatDate(data.updated_at)}\n\n`;

    if (data.body) {
      result += `## Description\n\n${data.body}\n\n`;
    }

    result += `**URL**: ${data.html_url}\n`;

    return result;
  } catch (error) {
    if (error instanceof Error && "status" in error && error.status === 404) {
      return `❌ Error: Issue not found\n\nIssue #${params.issue_number} does not exist in '${params.owner}/${params.repo}'.`;
    }
    return `❌ Error: ${
      error instanceof Error ? error.message : "Unknown error"
    }`;
  }
}
