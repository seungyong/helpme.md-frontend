export enum APIEndpoint {
  OAUTH2_LOGIN = "/oauth2/login",
  OAUTH2_CHECK = "/oauth2/check",
  OAUTH2_LOGOUT = "/users/logout",
  TOKEN_REISSUE = "/users/reissue",
  INSTALLATIONS = "/oauth2/installations",
  REPOSITORIES = "/repos",
  SECTIONS = "/repos/:owner/:name/sections",
  SECTIONS_INIT = "/repos/:owner/:name/sections/init",
  SECTIONS_REORDER = "/repos/:owner/:name/sections/reorder",
  SECTIONS_CONTENT = "/repos/:owner/:name/sections/content",
  SECTIONS_DELETE = "/repos/:owner/:name/sections/:sectionId",
  BRANCHES = "/repos/:owner/:name/branches",
  SSE = "/sse/subscribe",
  GENERATE = "/repos/:owner/:name/generate/sse",
  GENERATE_FALLBACK = "/repos/fallback/generate/:taskId",
  EVALUATE = "/repos/:owner/:name/evaluate/draft/sse",
  EVALUATE_FALLBACK = "/repos/fallback/evaluate/draft/:taskId",
}

/**
 * APIEndpoint를 동적으로 생성하는 함수
 * :변수명 형식의 플레이스홀더를 순서대로 인자로 치환
 *
 * @example
 * generateAPIEndpoint("/repos/:owner/:name/generate", "myOwner", "myRepo")
 * => "/repos/myOwner/myRepo/generate"
 *
 * generateAPIEndpoint("/fallback/generate/:taskId", "abc123")
 * => "/fallback/generate/abc123"
 *
 * @param endpoint - APIEndpoint (플레이스홀더 포함)
 * @param args - 플레이스홀더를 치환할 인자들 (순서대로)
 * @returns 생성된 APIEndpoint
 */
export const generateAPIEndpoint = (
  endpoint: APIEndpoint,
  ...args: string[]
): string => {
  let result = endpoint as string;

  // ✅ :변수명 패턴을 찾아서 순서대로 치환
  args.forEach((arg) => {
    result = result.replace(/:[^/]+/, arg);
  });

  return result;
};
