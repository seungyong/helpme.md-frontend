import { useMemo } from "react";

import styles from "./Header.module.scss";

import arrowUp from "@assets/images/arrow-up.svg";
import evaluation from "@assets/images/evaluation.svg";
import generate from "@assets/images/generate.svg";

import { Repository } from "@src/types/Repository";
import { EvaluationStatus } from "@src/types/evaluation";

const Header = ({ repo }: { repo: Repository }) => {
  const sortedBranches = useMemo(
    () =>
      repo.branches.sort((a, b) => {
        if (a === repo.defaultBranch) return -1;
        if (b === repo.defaultBranch) return 1;
        return 0;
      }) || [],
    [repo.branches, repo.defaultBranch]
  );

  const evaluationStatusMsg: string = useMemo(() => {
    switch (repo.evaluation.status) {
      case EvaluationStatus.GOOD:
        return "README 양호";
      case EvaluationStatus.CREATED:
        return "README 존재";
      case EvaluationStatus.IMPROVEMENT:
        return "개선 필요";
      case EvaluationStatus.NONE:
      default:
        return "README 없음";
    }
  }, [repo.evaluation.status]);

  const evaluationStatusStyle: string = useMemo(() => {
    switch (repo.evaluation.status) {
      case EvaluationStatus.GOOD:
        return styles.good;
      case EvaluationStatus.CREATED:
        return styles.created;
      case EvaluationStatus.IMPROVEMENT:
        return styles.improvement;
      case EvaluationStatus.NONE:
      default:
        return styles.none;
    }
  }, [repo.evaluation.status]);

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
        <p
          className={`
                ${styles.repoDetailStatus}
                ${evaluationStatusStyle}
              `}
        >
          {evaluationStatusMsg}
        </p>
      </div>
      <div className={styles.repoDetailHeaderRight}>
        <select className={styles.branchSelect}>
          {sortedBranches.map((branch) => (
            <option
              key={branch}
              value={branch}
              defaultChecked={branch === repo.defaultBranch ? true : false}
            >
              {branch}
            </option>
          ))}
        </select>
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
