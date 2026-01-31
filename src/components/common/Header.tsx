import styles from "./header.module.scss";
import logo from "@assets/images/logo.svg";

import { useAuthContext } from "@src/hooks/useAuthContext";
import { useIsRepoPage } from "@src/hooks/useIsRepoPage";

const Header = () => {
  const isRepoPage = useIsRepoPage();
  const { isLoggedIn } = useAuthContext();

  console.log(isLoggedIn);

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
      </div>
    </header>
  );
};

export default Header;
