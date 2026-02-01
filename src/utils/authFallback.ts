import { ApiError } from "@src/types/error";

/**
 * AUTH_40103 에러 발생 시 토큰 재발급 및 원래 요청 재시도
 * @param error 발생한 에러
 * @param retryFn 재시도할 함수 (원래 API 요청)
 * @returns 재시도 결과 또는 에러
 */
export const authFallback = async <T>(
  error: Error,
  retryFn?: () => Promise<T>
): Promise<T | void> => {
  // error가 ApiError 인스턴스가 아니라면 예외 처리
  if (!(error instanceof ApiError)) {
    throw error;
  }

  // AUTH_40103: Access Token 만료
  if (error.status === 401 && error.status === 401) {
    try {
      // Access Token 재발급 요청
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/reissue`,
        {
          credentials: "include",
          method: "POST",
        }
      );

      if (!response.ok) {
        // 재발급 실패 시 원래 에러를 throw
        throw error;
      }

      // 재발급 성공 시, 원래 요청 재시도
      if (retryFn) {
        return await retryFn();
      }

      return;
    } catch {
      // 재발급 실패 시 원래 에러를 throw
      throw error;
    }
  }

  // 다른 에러는 그대로 throw
  throw error;
};