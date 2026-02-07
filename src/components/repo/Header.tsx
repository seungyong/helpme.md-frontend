import styles from "./Header.module.scss";

import { Repository } from "@src/types/repository";

import ResetButton from "@src/features/ResetButton";
import EvaluationButton from "@src/features/EvaluationButton";
import GenerationButton from "@src/features/GenerationButton";
import PRButton from "@src/features/PRButton";

const Header = ({ repo }: { repo: Repository }) => {
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
        <ResetButton />
        <EvaluationButton />
        <GenerationButton />
        <PRButton />
      </div>
    </div>
  );
};

export default Header;
