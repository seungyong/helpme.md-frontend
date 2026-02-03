import { Component } from "./component";
import { Evaluation } from "./evaluation";

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
  content: string;
  branches: string[];
  defaultBranch: string;
  owner: string;
  name: string;
  avatarUrl: string;
  components: Component[];
  evaluation: Evaluation;
}
