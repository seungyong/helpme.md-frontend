import { APIEndpoint } from "@src/types/APIEndpoint";
import { ApiError } from "@src/types/error";
import { Sections } from "@src/types/section";
import { useQueryClient } from "@tanstack/react-query";

/**
 * SSE 리스너 훅
 *
 * 이벤트 리스너는 이벤트가 발생할 때마다 쿼리 데이터를 업데이트합니다.
 * 리스너는 한 번만 실행되며, 이벤트가 발생할 때마다 쿼리 데이터를 업데이트합니다.
 *
 * @param queryKey - 쿼리 키
 * @param eventName - 이벤트 이름
 * @returns { listen } - 이벤트 리스너 함수
 */
export const useSse = (queryKey: string[], eventName: string) => {
  const queryClient = useQueryClient();

  const listen = () => {
    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_URL}${APIEndpoint.SSE}`
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
        queryClient.setQueryData(queryKey, data as Sections);
      }

      stop(eventSource);
    });

    eventSource.addEventListener(eventName + "-error", (event) => {
      const error = event.data && JSON.parse(event.data);
      if (error) {
        queryClient.setQueryData([...queryKey, "error"], error as ApiError);
      }

      stop(eventSource);
    });
  };

  const stop = (eventSource: EventSource) => {
    eventSource.close();
  };

  return { listen };
};
