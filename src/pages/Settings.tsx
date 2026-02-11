import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import styles from "./Settings.module.scss";

import { User } from "@src/types/user";
import { APIEndpoint } from "@src/types/APIEndpoint";

import { apiClient } from "@src/utils/apiClient";
import { useAuth } from "@src/hooks/useAuth";

const Settings = () => {
  const navigate = useNavigate();
  const { isLoggedIn, withdraw } = useAuth();

  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);

  const { mutate: getUserMutation } = useMutation<User>({
    mutationFn: async () => {
      return apiClient
        .get<User>(APIEndpoint.USER_INFO)
        .then((response) => response.data);
    },
    onSuccess: (data) => {
      setUsername(data.username);
    },
  });

  const handleWithdraw = useCallback(async () => {
    if (isDisabled) {
      return;
    }

    setIsDisabled(true);

    try {
      await withdraw();
    } finally {
      setIsDisabled(false);
      navigate("/");
    }
  }, [isDisabled, withdraw, navigate]);

  const handleGithubAppLink = useCallback(() => {
    window.open(
      `${import.meta.env.VITE_GITHUB_INSTALLATION_URL}`,
      "_blank",
      "width=800,height=600"
    );
  }, []);

  useEffect(() => {
    getUserMutation();
  }, [getUserMutation]);

  if (!isLoggedIn) {
    sessionStorage.setItem("redirectUrl", "/settings");
    window.location.replace(
      `${import.meta.env.VITE_API_URL}${APIEndpoint.OAUTH2_LOGIN}`
    );
  }

  return (
    <div className={styles.settings}>
      <div className={styles.header}>
        <h1 className="text-emphasis-large">Settings</h1>
        <p className="text-description text-sub-color">
          계정과 Github App 연결 상태, Repository 권한 관리 등을 할 수 있습니다.
        </p>
      </div>
      <div className={styles.sectionList}>
        <section className={styles.section} aria-label="연결된 Github 계정">
          <div className={styles.sectionText}>
            <p className={styles.sectionTitle}>연결된 Github 계정</p>
            <p className={styles.sectionDescription}>
              서비스에 연결된 Github 계정 정보입니다.
            </p>
          </div>
          <div className={styles.sectionAction}>
            <Link
              to={`https://github.com/${username}`}
              target="_blank"
              className={styles.linkButton}
            >
              Github 이동
            </Link>
          </div>
        </section>

        <section className={styles.section} aria-label="연결된 Github App">
          <div className={styles.sectionText}>
            <p className={styles.sectionTitle}>연결된 Github App</p>
            <p className={styles.sectionDescription}>
              서비스에 연결된 Github App 정보와 Repository 관리를 할 수
              있습니다.
            </p>
          </div>
          <div className={styles.sectionAction}>
            <button
              type="button"
              className={styles.linkButton}
              onClick={handleGithubAppLink}
            >
              Repository 관리
            </button>
          </div>
        </section>

        <section className={styles.section} aria-label="계정 삭제">
          <div className={styles.sectionText}>
            <p className={styles.sectionTitle}>계정 삭제</p>
            <p className={styles.deleteDescription}>
              계정을 삭제하면 Helpme에 저장된 Repository 정보 및 메타데이터,
              개인 정보 등이 모두 삭제되며, 이 작업은 되돌릴 수 없습니다. 단,
              Github App과 연결된 Repository는 삭제되지 않습니다.
            </p>
          </div>
          <div className={styles.sectionAction}>
            <button
              type="button"
              className={styles.deleteButton}
              onClick={handleWithdraw}
              disabled={isDisabled}
            >
              {isDisabled ? "계정 삭제 중..." : "계정 삭제"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
