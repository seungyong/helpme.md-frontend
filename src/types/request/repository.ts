export interface CreateSectionRequest {
  title: string;
  content: string | null;
}

export interface InitSectionRequest {
  branch: string;
  splitMode: "split" | "whole";
}

export interface ReorderSectionRequest {
  sectionIds: number[];
}

export interface UpdateSectionContentRequest {
  sectionId: number;
  content: string;
}

export interface DeleteSectionRequest {
  sectionId: number;
}
