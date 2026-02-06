import styles from "./Header.module.scss";

import arrowUp from "@assets/images/arrow-up.svg";
import evaluation from "@assets/images/evaluation.svg";
import generate from "@assets/images/generate.svg";
import reset from "@assets/images/reset.svg";

import { Repository } from "@src/types/repository";

import { useSection } from "@src/hooks/useSection";

const Header = ({ repo }: { repo: Repository }) => {
  const { resetSection } = useSection();

  const handleResetSection = () => {
    resetSection("split");
  };

  return (
    <div className={styles.repoDetailHeader}>
      <div className={styles.repoDetailHeaderLeft}>
        <img
          src={repo.avatarUrl}
          alt="avatar"
          className={styles.repoDetailAvatar}
        />
        <h1 className={`text-emphasis-large ${styles.mainTitle}`}>
          {repo.owner}/{repo.name}
        </h1>
      </div>
      <div className={styles.repoDetailHeaderRight}>
        <button
          className={`${styles.btn} ${styles.resetBtn}`}
          onClick={handleResetSection}
        >
          <img src={reset} alt="reset" />
          README 초기화
        </button>
        <button className={`${styles.btn} ${styles.evaluationBtn}`}>
          <img src={evaluation} alt="evaluation" />
          README 평가
        </button>
        <button className={`${styles.btn} ${styles.generateBtn}`}>
          <img src={generate} alt="generate" />
          AI 초안 생성
        </button>
        <button className={`${styles.btn} ${styles.prBtn}`}>
          <img src={arrowUp} alt="pr" />
          PR 생성
        </button>
      </div>
    </div>
  );
};

export default Header;
