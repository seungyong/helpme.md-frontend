export interface Repositories {
  repositories: RepositoryItem[];
  totalCount: number;
}

export interface RepositoryItem {
  avatarUrl: string;
  name: string;
  owner: string;
}
