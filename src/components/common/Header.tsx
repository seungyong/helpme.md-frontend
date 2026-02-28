import { useCallback } from "react";

import styles from "./Header.module.scss";

import logoIcon from "/logo.svg";
import logoutIcon from "@assets/images/logout.svg";
import settings from "@assets/images/settings.svg";

import { useAuth } from "@src/hooks/useAuth";
import { useIsRepoPage } from "@src/hooks/useIsRepoPage";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const isRepoPage = useIsRepoPage();
  const { isLoggedIn, isLoading, logout } = useAuth();

  const handleLogout = useCallback(async () => {
    if (!isLoggedIn && !isLoading) {
      return;
    }

    await logout();
    navigate("/");
  }, [isLoggedIn, isLoading, logout, navigate]);

  return (
    <header className={styles.header}>
      <div
        className={`${styles.headerContent} ${isRepoPage ? styles.repo : ""}`}
      >
        <div className={styles.headerLeft}>
          <Link to="/">
            <img src={logoIcon} alt="logo" />
          </Link>
          <div className={styles.headerLeftTitle}>
            <Link to="/" className={styles.linkTitle}>
              <p className="text-emphasis-medium">Helpme.md</p>
            </Link>
            <p className={styles.subTitle}>README Generator</p>
          </div>
        </div>
        {isLoggedIn && (
          <div className={styles.headerRight}>
            <button onClick={handleLogout} aria-label="로그아웃">
              <img src={logoutIcon} alt="logout" />
            </button>
            <Link to="/settings" aria-label="설정">
              <img src={settings} alt="settings" />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
