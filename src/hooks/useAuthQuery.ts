import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { APIEndpoint } from "@src/types/APIEndpoint";
import { ApiError } from "@src/types/error";

import { apiClient } from "@src/utils/apiClient";

export const useAuthQuery = () => {
  return useQuery({
    queryKey: ["auth"],
    queryFn: async (): Promise<null> => {
      return apiClient<null>(APIEndpoint.OAUTH2_CHECK, {
        method: "POST",
      });
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5분간 fresh 상태 유지
  });
};

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<null> => {
      return apiClient<null>(APIEndpoint.OAUTH2_CHECK, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.setQueryData(["auth"], null);
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 401) {
        queryClient.removeQueries({ queryKey: ["auth"] });
      }
    },
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<null> => {
      return apiClient<null>(APIEndpoint.USER_LOGOUT, {
        method: "POST",
      });
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["auth"] });
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 401) {
        queryClient.removeQueries({ queryKey: ["auth"] });
      }
    },
  });
};

export const useWithdrawMutation = (onSettled: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<null> => {
      return apiClient<null>(APIEndpoint.USER_WITHDRAW, {
        method: "DELETE",
      });
    },
    onSettled: () => {
      onSettled();
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["auth"] });
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 401) {
        queryClient.removeQueries({ queryKey: ["auth"] });
      }
    },
  });
};
