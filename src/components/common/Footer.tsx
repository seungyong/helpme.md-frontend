import styles from "./footer.module.scss";

import { useIsRepoPage } from "@src/hooks/useIsRepoPage";

const Footer = () => {
  const isRepoPage = useIsRepoPage();

  return (
    <>
      {!isRepoPage && (
        <footer className={styles.footer}>
          <p>Copyright 2026. Kim Seung-yong All rights reserved.</p>
        </footer>
      )}
    </>
  );
};

export default Footer;
