import styles from "./header.module.scss";

import logo from "@assets/images/logo.svg";
import logout from "@assets/images/logout.svg";
import settings from "@assets/images/settings.svg";

import { useAuthContext } from "@src/hooks/useAuthContext";
import { useIsRepoPage } from "@src/hooks/useIsRepoPage";
import { Link } from "react-router-dom";

const Header = () => {
  const isRepoPage = useIsRepoPage();
  const { isLoggedIn } = useAuthContext();

  return (
    <header className={styles.header}>
      <div
        className={`${styles.headerContent} ${isRepoPage ? styles.repo : ""}`}
      >
        <div className={styles.headerLeft}>
          <img src={logo} alt="logo" />
          <div className={styles.headerLeftTitle}>
            <p className="text-emphasis-medium">Helpme.md</p>
            <p className={styles.subTitle}>README Generator</p>
          </div>
        </div>
        {isLoggedIn && (
          <div className={styles.headerRight}>
            <button>
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
