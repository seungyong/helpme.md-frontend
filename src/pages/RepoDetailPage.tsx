import { useParams } from "react-router-dom";

import styles from "./RepoDetailPage.module.scss";

const RepoDetailPage = () => {
  const { owner, name } = useParams();

  return (
    <main className={styles.main}>
      <section className={styles.mainSection}>
        <h1 className={`text-emphasis-large ${styles.mainTitle}`}>
          {owner}/{name}
        </h1>
      </section>
    </main>
  );
};

export default RepoDetailPage;
