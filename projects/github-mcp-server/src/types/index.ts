export interface SearchReposParams {
  query: string;
  sort?: 'stars' | 'forks' | 'updated';
  order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface GetRepoParams {
  owner: string;
  repo: string;
}

export interface ListIssuesParams {
  owner: string;
  repo: string;
  state?: 'open' | 'closed' | 'all';
  labels?: string;
  per_page?: number;
  page?: number;
}

export interface GetIssueParams {
  owner: string;
  repo: string;
  issue_number: number;
}

export interface ListPRsParams {
  owner: string;
  repo: string;
  state?: 'open' | 'closed' | 'all';
  per_page?: number;
  page?: number;
}

export interface GetPRParams {
  owner: string;
  repo: string;
  pull_number: number;
}

export interface ListUserReposParams {
  username?: string;
  type?: 'all' | 'owner' | 'member';
  sort?: 'created' | 'updated' | 'pushed' | 'full_name';
  direction?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface GitHubConfig {
  token?: string;
}
