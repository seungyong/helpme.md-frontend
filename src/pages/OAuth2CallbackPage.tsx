import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { useAuth } from "@src/hooks/useAuth";

const OAuth2CallbackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const processedRef = useRef(false);

  const previousPath = useMemo(
    () => location.state?.previousPath || "/",
    [location.state]
  );
  // URL에서 error 파라미터 확인
  const hasError = useMemo(
    () => new URLSearchParams(window.location.search).get("error"),
    []
  );

  // OAuth2 인증 성공 시 처리
  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    if (!hasError) {
      login();
      const redirectUrl = sessionStorage.getItem("redirectUrl") || previousPath;
      sessionStorage.removeItem("redirectUrl");
      navigate(redirectUrl, { replace: true });
    }
  }, [hasError, previousPath, login, navigate]);

  useEffect(() => {
    if (hasError) {
      toast.error("로그인에 실패했습니다.\n잠시 후 다시 시도해주세요.", {
        icon: "🚫",
      });
      navigate(previousPath, { replace: true });
    }
  }, [hasError, previousPath, navigate]);

  return <></>;
};

export default OAuth2CallbackPage;
