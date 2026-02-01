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