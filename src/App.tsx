import Header from "@src/components/common/Header";
import { useIsRepoPage } from "@src/hooks/useIsRepoPage";

import MainPage from "@src/pages/MainPage";

import styles from "./App.module.scss";

const App = () => {
  const isRepoPage = useIsRepoPage();

  return (
    <div className={`${isRepoPage ? styles.repo : ""}`}>
      <Header />
      <div className={styles.content}>
        <MainPage />
      </div>
    </div>
  );
};

export default App;
