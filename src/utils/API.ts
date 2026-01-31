import { ErrorResponse } from "@src/types/error";

const API_URL = import.meta.env.VITE_API_URL;

interface RequestOptions {
  headers?: HeadersInit;
  body?: unknown;
}

/**
 * API 에러 클래스
 */
export class ApiError extends Error {
  status: number;
  errorCode: string;
  error: string;
  code: string;

  constructor(errorResponse: ErrorResponse) {
    super(errorResponse.message);
    this.status = errorResponse.status;
    this.errorCode = errorResponse.errorCode;
    this.error = errorResponse.error;
    this.code = errorResponse.code;
  }
}

/**
 * HTTP 요청을 처리하는 기본 함수
 */
async function request<T>(
  url: string,
  method: string,
  options?: RequestOptions
): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options?.headers,
  };

  const config: RequestInit = {
    method,
    headers,
    credentials: "include",
  };

  if (options?.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_URL}${url}`, config);

  // 204 No Content인 경우 null 반환
  if (response.status === 204) {
    return null as T;
  }

  // 에러 응답 처리
  if (!response.ok) {
    try {
      const errorData: ErrorResponse = await response.json();
      throw new ApiError(errorData);
    } catch (error) {
      // JSON 파싱 실패 시 기본 에러
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError({
        status: response.status,
        errorCode: "UNKNOWN_ERROR",
        error: response.statusText,
        code: "UNKNOWN",
        message: `HTTP error! status: ${response.status}`,
      });
    }
  }

  return response.json();
}

/**
 * API 요청 유틸리티
 */
export const API = {
  /**
   * GET 요청
   * @param url - 요청 URL
   * @param headers - 추가 헤더 (선택)
   */
  async get<T>(url: string, headers?: HeadersInit): Promise<T> {
    return request<T>(url, "GET", { headers });
  },

  /**
   * POST 요청
   * @param url - 요청 URL
   * @param body - 요청 바디
   * @param headers - 추가 헤더 (선택)
   */
  async post<T>(
    url: string,
    body?: unknown,
    headers?: HeadersInit
  ): Promise<T> {
    return request<T>(url, "POST", { body, headers });
  },

  /**
   * PATCH 요청
   * @param url - 요청 URL
   * @param body - 요청 바디
   * @param headers - 추가 헤더 (선택)
   */
  async patch<T>(
    url: string,
    body?: unknown,
    headers?: HeadersInit
  ): Promise<T> {
    return request<T>(url, "PATCH", { body, headers });
  },

  /**
   * PUT 요청
   * @param url - 요청 URL
   * @param body - 요청 바디
   * @param headers - 추가 헤더 (선택)
   */
  async put<T>(url: string, body?: unknown, headers?: HeadersInit): Promise<T> {
    return request<T>(url, "PUT", { body, headers });
  },

  /**
   * DELETE 요청
   * @param url - 요청 URL
   * @param headers - 추가 헤더 (선택)
   */
  async delete<T>(url: string, headers?: HeadersInit): Promise<T> {
    return request<T>(url, "DELETE", { headers });
  },
};
