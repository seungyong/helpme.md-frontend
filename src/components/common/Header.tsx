import styles from "./header.module.scss";

import logo from "@assets/images/logo.svg";
import logout from "@assets/images/logout.svg";
import settings from "@assets/images/settings.svg";

import { useAuth } from "@src/hooks/useAuth";
import { useLogoutMutation } from "@src/hooks/useAuthQuery";
import { useIsRepoPage } from "@src/hooks/useIsRepoPage";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const isRepoPage = useIsRepoPage();
  const { isLoggedIn } = useAuth();
  const { mutateAsync: logoutAsync } = useLogoutMutation();

  const handleLogout = async () => {
    if (!isLoggedIn) {
      return;
    }

    await logoutAsync();
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <div
        className={`${styles.headerContent} ${isRepoPage ? styles.repo : ""}`}
      >
        <div className={styles.headerLeft}>
          <Link to="/">
            <img src={logo} alt="logo" />
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
            <button onClick={handleLogout}>
              <img src={logout} alt="logout" />
            </button>
            <Link to="/settings">
              <img src={settings} alt="settings" />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
