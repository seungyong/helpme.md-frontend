import { ApiError } from "@src/types/error";
import { apiClient } from "@src/utils/apiClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAuthQuery = () => {
  return useQuery({
    queryKey: ["auth"],
    queryFn: async (): Promise<null> => {
      return apiClient<null>("/oauth2/check", {
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
      return apiClient<null>("/oauth2/check", {
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
      return apiClient<null>("/oauth2/logout", {
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
