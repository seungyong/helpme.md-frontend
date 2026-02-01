import { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { useAuthContext } from "@src/hooks/useAuthContext";
import { ApiError } from "@src/types/error";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@src/utils/apiClient";

const OAuth2CallbackPage = () => {
  const { setIsLoggedIn } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();

  // URL에서 error 파라미터 확인
  const hasError = new URLSearchParams(window.location.search).get("error");

  const handleSuccess = useCallback(() => {
    setIsLoggedIn(true);
    const redirectUrl = sessionStorage.getItem("redirectUrl");

    if (redirectUrl) {
      sessionStorage.removeItem("redirectUrl");
      navigate(redirectUrl, { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate, setIsLoggedIn]);

  // error가 없을 때만 API 호출, 캐싱 방지 설정
  const { isSuccess, isError } = useQuery<null, ApiError>({
    queryKey: ["oauth2/check"],
    queryFn: async (): Promise<null> => {
      return await apiClient<null>("/oauth2/check", {
        method: "POST"
      });
    },
    enabled: !hasError,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
  });

  // API 성공 시 처리
  useEffect(() => {
    if (isSuccess) {
      toast.success("로그인 성공", {
        icon: "🎉",
      });
      handleSuccess();
    }
  }, [isSuccess, handleSuccess]);

  // API 실패 시 처리
  useEffect(() => {
    if (isError) {
      toast.error("서버에 문제가 발생했습니다.\n잠시 후 다시 시도해주세요.", {
        icon: "🚫",
      });
      navigate("/", { replace: true });
    }
  }, [isError, navigate]);

  // error 파라미터가 있을 경우 처리
  useEffect(() => {
    if (hasError) {
      const previousPath = location.state?.previousPath || "/";
      navigate(previousPath, { replace: true });
    }
  }, [hasError, location.state?.previousPath, navigate]);

  return <></>;
};

export default OAuth2CallbackPage;
