import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useLoginMutation } from "@src/hooks/useAuthQuery";

const OAuth2CallbackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mutate: login } = useLoginMutation();

  const previousPath = location.state?.previousPath || "/";
  // URL에서 error 파라미터 확인
  const hasError = new URLSearchParams(window.location.search).get("error");

  // OAuth2 인증 성공 시 처리
  useEffect(() => {
    if (!hasError) {
      login(undefined, {
        onSuccess: () => {
          toast.success("로그인 성공", {
            icon: "🎉",
          });

          const redirectUrl = sessionStorage.getItem("redirectUrl");
          if (redirectUrl) {
            sessionStorage.removeItem("redirectUrl");
            navigate(redirectUrl, { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        },
        onError: () => {
          toast.error(
            "서버에 연결할 수 없습니다.\n잠시 후 다시 시도해주세요.",
            {
              icon: "🚫",
            }
          );
          navigate(previousPath, { replace: true });
        },
      });
    }
  }, [hasError, previousPath, login, navigate]);

  // error 파라미터가 있을 경우 처리
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
