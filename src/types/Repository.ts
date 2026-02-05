export interface Repositories {
  repositories: RepositoryItem[];
  totalCount: number;
}

export interface RepositoryItem {
  avatarUrl: string;
  name: string;
  owner: string;
}

export interface Repository {
  owner: string;
  name: string;
  avatarUrl: string;
  defaultBranch: string;
}
