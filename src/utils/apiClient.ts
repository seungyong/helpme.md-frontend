import { ApiError, ERROR_CODE } from "@src/types/error";
import { authFallback } from "./authFallback";

/**
 * API 요청을 보내는 공통 함수
 * AUTH_40103 에러 발생 시 자동으로 토큰 재발급 후 재시도
 */
export const apiClient = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const makeRequest = async (): Promise<T> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${url}`, {
      ...options,
      credentials: "include", // 쿠키 포함
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    // 응답이 실패한 경우
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        status: response.status,
        error: response.statusText,
        errorCode: "UNKNOWN_ERROR",
        code: "UNKNOWN",
        message: "An unknown error occurred",
      }));

      throw new ApiError({
        status: response.status,
        error: errorData.error || response.statusText,
        errorCode: errorData.errorCode || "UNKNOWN_ERROR",
        code: errorData.code || "UNKNOWN",
        message: errorData.message || "An unknown error occurred",
      });
    }

    // 응답이 성공한 경우
    // 204 No Content인 경우 빈 객체 반환
    if (response.status === 204) {
      return null as T;
    }

    return await response.json();
  };

  try {
    return await makeRequest();
  } catch (error) {
    const isGithubAuthError: boolean =
      error instanceof ApiError &&
      error.status === 401 &&
      error.errorCode === ERROR_CODE.GITHUB_UNAUTHORIZED;
    const isNoTokenError: boolean =
      error instanceof ApiError &&
      error.status === 401 &&
      error.errorCode === ERROR_CODE.NOT_FOUND_TOKEN;

    // Github OAuth, No Token 에러 제외한 401 에러인 경우 authFallback으로 토큰 재발급 및 재시도
    if (
      error instanceof ApiError &&
      error.status === 401 &&
      !isGithubAuthError &&
      !isNoTokenError
    ) {
      return (await authFallback(error, makeRequest)) as T;
    }

    // 다른 에러는 그대로 throw
    throw error;
  }
};
