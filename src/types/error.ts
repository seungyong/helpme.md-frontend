interface ResponseError {
  status: number;
  error: string;
  errorCode: string;
  code: string;
  message: string;
}

/**
 * API 에러 클래스
 */
export class ApiError extends Error {
  status: number;
  errorCode: string;
  error: string;
  code: string;

  constructor(errorResponse: ResponseError) {
    super(errorResponse.message);
    this.status = errorResponse.status;
    this.errorCode = errorResponse.errorCode;
    this.error = errorResponse.error;
    this.code = errorResponse.code;
  }
}

export const ERROR_CODE = {
  // Global Error Codes
  BAD_REQUEST: "VALID_400",
  INVALID_TOKEN: "AUTH_40101",
  EXPIRED_ACCESS_TOKEN: "AUTH_40102",
  NOT_FOUND_TOKEN: "AUTH_40103",
  INTERNAL_SERVER_ERROR: "SERVER_500",
  GITHUB_ERROR: "GITHUB_50001",
  REDIS_ERROR: "REDIS_50002",
  INVALID_OAUTH2_STATE: "OAUTH2_50003",
  GPT_ERROR: "GPT_50004",

  // Component Error Codes
  COMPONENT_NOT_FOUND: "COMPONENT_40401",

  // Repository Error Codes
  BAD_REQUEST_SAME_BRANCH: "REPO_40001",
  GITHUB_UNAUTHORIZED: "REPO_40101",
  GITHUB_FORBIDDEN: "REPO_40301",
  REPOSITORY_CANNOT_PULL: "REPO_40302",
  REPOSITORY_README_NOT_FOUND: "REPO_40401",
  BRANCH_NOT_FOUND: "REPO_40402",
  REPOSITORY_OR_BRANCH_NOT_FOUND: "REPO_40403",
  INSTALLED_REPOSITORY_NOT_FOUND: "REPO_40404",
  FALLBACK_NOT_FOUND: "REPO_40405",
  GITHUB_RATE_LIMIT_EXCEEDED: "REPO_42901",
  GITHUB_BRANCHES_TOO_MANY_REQUESTS: "REPO_42902",
  JSON_PROCESSING_ERROR: "REPO_50001",

  // SSE Error Codes
  CONNECTION_FAILED: "SSE_50001",

  // User Error Codes
  USER_NOT_FOUND: "USER_40401",
} as const;

export type ErrorCodeType = (typeof ERROR_CODE)[keyof typeof ERROR_CODE];