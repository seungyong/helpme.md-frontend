import axios from "axios";

import { ApiError, ERROR_CODE } from "@src/types/error";
import { APIEndpoint } from "@src/types/APIEndpoint";

type FailedRequest = {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
};

let isRefreshing = false;
let failedRequests: FailedRequest[] = [];

const API_URL = import.meta.env.VITE_API_URL;

const createApiError = (error): ApiError => {
  if (axios.isAxiosError(error) && error.response?.data) {
    const data = error.response.data;

    return new ApiError({
      status: error.response.status,
      error: data.error,
      errorCode: data.errorCode,
      code: data.code,
      message: data.message,
    });
  }

  const defaultError = new ApiError({
    status: 500,
    error: "Internal Server Error",
    errorCode: "SERVER_500",
    code: "SERVER_500",
    message: "Internal Server Error",
  });

  return defaultError;
};

const processQueue = (error: unknown, token: string | null = null) => {
  failedRequests.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedRequests = [];
};

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response || !originalRequest || originalRequest._retry) {
      return Promise.reject(createApiError(error));
    }

    const errorCode = error.response?.data?.errorCode;
    const isExpiredAccessTokenError: boolean =
      errorCode === ERROR_CODE.EXPIRED_ACCESS_TOKEN;

    if (isExpiredAccessTokenError) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequests.push({ resolve, reject });
        })
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(createApiError(err));
          });
      }

      isRefreshing = true;
      originalRequest._retry = true;

      try {
        await axios.post(API_URL + APIEndpoint.TOKEN_REISSUE, null, {
          withCredentials: true,
        });

        processQueue(null);

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);

        const currentPath = window.location.pathname;
        if (currentPath !== "/") {
          sessionStorage.setItem("redirectUrl", window.location.pathname);
          window.location.href = `${import.meta.env.VITE_API_URL}${APIEndpoint.OAUTH2_LOGIN}`;
        }

        return Promise.reject(createApiError(refreshError));
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(createApiError(error));
  }
);
