import { APIEndpoint } from "@src/types/APIEndpoint";
import { ApiError } from "@src/types/error";
import { Sections } from "@src/types/section";
import { useQueryClient } from "@tanstack/react-query";

export interface SseListenOptions<T = Sections> {
  onSuccess?: (data: T) => void;
  onError?: (error: ApiError) => void;
}

/**
 * SSE 리스너 훅
 *
 * 이벤트 리스너는 이벤트가 발생할 때마다 쿼리 데이터를 업데이트합니다.
 * 결과는 비동기로 오므로, 실제 결과 처리 시에는 onSuccess 콜백을 사용하세요.
 *
 * @param queryKey - 쿼리 키
 * @param eventName - 이벤트 이름
 * @returns { listen } - 이벤트 리스너 함수 (옵션으로 onSuccess/onError 콜백 전달)
 */
export const useSse = (queryKey: string[], eventName: string) => {
  const queryClient = useQueryClient();

  const listen = <T = Sections>(options?: SseListenOptions<T>) => {
    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_URL}${APIEndpoint.SSE}`,
      {
        withCredentials: true,
      }
    );

    eventSource.addEventListener("connected", (event) => {
      const data = event.data && JSON.parse(event.data);

      if (data.taskId) {
        queryClient.setQueryData(
          [...queryKey, "taskId"],
          data.taskId as string
        );
      }
    });

    eventSource.addEventListener(eventName, (event) => {
      const data = event.data && JSON.parse(event.data);
      if (data) {
        queryClient.setQueryData(queryKey, data);
        options?.onSuccess?.(data as T);
      }

      stop(eventSource);
    });

    eventSource.addEventListener(eventName + "-error", (event) => {
      const error = event.data && JSON.parse(event.data);
      if (error) {
        queryClient.setQueryData([...queryKey, "error"], error as ApiError);
        options?.onError?.(error as ApiError);
      }

      stop(eventSource);
    });
  };

  const stop = (eventSource: EventSource) => {
    eventSource.close();
  };

  return { listen };
};
