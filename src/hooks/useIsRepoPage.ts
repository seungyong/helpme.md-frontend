import { useLocation } from "react-router-dom";

/**
 * 현재 경로가 /repo/:owner/:name 형식인지 확인하는 훅
 * @returns {boolean} /repo/:owner/:name 경로이면 true, 아니면 false
 */
export const useIsRepoPage = (): boolean => {
  const location = useLocation();

  // /repo/:owner/:name 형식인지 확인
  const repoPathPattern = /^\/repo\/[^/]+\/[^/]+$/;
  return repoPathPattern.test(location.pathname);
};
