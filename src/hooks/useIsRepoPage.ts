import { useLocation } from "react-router-dom";

/**
 * 현재 경로가 /repo 페이지인지 확인하는 훅
 * @returns {boolean} /repo 경로이면 true, 아니면 false
 */
export const useIsRepoPage = (): boolean => {
  const location = useLocation();
  return location.pathname.includes("/repo");
};
