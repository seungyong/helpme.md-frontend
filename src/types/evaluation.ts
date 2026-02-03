export enum EvaluationStatus {
  GOOD = "GOOD",
  CREATED = "CREATED",
  IMPROVEMENT = "IMPROVEMENT",
  NONE = "NONE",
}

export interface Evaluation {
  status: EvaluationStatus;
  rating: number | null;
  contents: string[] | null;
}
