import { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { API } from "@src/utils/API";
import { useAuthContext } from "@src/hooks/useAuthContext";

const OAuth2CallbackPage = () => {
  const { setIsLoggedIn } = useAuthContext();
  const location = useLocation();
  const navigate = useNavigate();

  const handleCheckAuth = useCallback(async () => {
    try {
      await API.post<object | null>("/oauth2/check");

      toast.success("로그인 성공", {
        icon: "🎉",
      });
    } catch {
      toast.error("서버에 문제가 발생했습니다.\n잠시 후 다시 시도해주세요.", {
        icon: "🚫",
      });
      navigate("/", { replace: true });
      return;
    }

    setIsLoggedIn(true);
    const redirectUrl = sessionStorage.getItem("redirectUrl");

    if (redirectUrl) {
      sessionStorage.removeItem("redirectUrl");
      navigate(redirectUrl, { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [navigate, setIsLoggedIn]);

  useEffect(() => {
    const error = new URLSearchParams(window.location.search).get("error");
    if (error) {
      const previousPath = location.state?.previousPath || "/";
      navigate(previousPath, { replace: true });
      return;
    }

    handleCheckAuth();
  }, [handleCheckAuth, location.state?.previousPath, navigate]);

  return <></>;
};

export default OAuth2CallbackPage;
