import { useEffect, useMemo } from "react";

import styles from "./EvaluationResult.module.scss";

import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import type { Evaluation } from "@src/types/evaluation";
import toast from "react-hot-toast";

enum RatingBadge {
  EXCELLENT = "excellent",
  GOOD = "good",
  NEED_IMPROVEMENT = "need_improvement",
  INSUFFICIENT = "insufficient",
}

const EvaluationResult = () => {
  const { owner, name } = useParams();
  const queryClient = useQueryClient();

  const queryKey = useMemo(
    () => ["evaluation", owner || "", name || ""],
    [owner, name]
  );

  const { data: evaluation } = useQuery<Evaluation | null>({
    queryKey,
    enabled: false,
    queryFn: async () =>
      (queryClient.getQueryData<Evaluation>(queryKey) as Evaluation | null) ??
      null,
    initialData: () =>
      (queryClient.getQueryData<Evaluation>(queryKey) as Evaluation | null) ??
      null,
  });

  const ratingBadge = useMemo(() => {
    if (!evaluation?.rating) {
      return null;
    }

    if (evaluation?.rating > 4.0) {
      return RatingBadge.EXCELLENT;
    } else if (evaluation?.rating > 3.0) {
      return RatingBadge.GOOD;
    } else if (evaluation?.rating > 2.0) {
      return RatingBadge.NEED_IMPROVEMENT;
    }

    return RatingBadge.INSUFFICIENT;
  }, [evaluation?.rating]);

  const ratingBadgeClassName = useMemo(() => {
    if (!ratingBadge) {
      return styles.badge;
    }

    const toneClass = styles[ratingBadge];
    return `${styles.badge} ${styles.ratingBadge} ${toneClass}`;
  }, [ratingBadge]);

  const ratingBadgeText = useMemo(() => {
    if (ratingBadge === RatingBadge.EXCELLENT) {
      return "우수";
    } else if (ratingBadge === RatingBadge.GOOD) {
      return "양호";
    } else if (ratingBadge === RatingBadge.NEED_IMPROVEMENT) {
      return "개선 필요";
    }

    return "부족";
  }, [ratingBadge]);

  const hasResult = useMemo(() => {
    return (
      evaluation && (evaluation.rating !== null || evaluation.contents?.length)
    );
  }, [evaluation]);

  const { pros, cons, others } = useMemo(() => {
    const pros: string[] = [];
    const cons: string[] = [];
    const others: string[] = [];

    if (!evaluation?.contents) {
      return { pros, cons, others };
    }

    evaluation.contents.forEach((line) => {
      const trimmed = line.trim();

      if (trimmed.startsWith("장점")) {
        pros.push(trimmed.replace(/^장점\s*:\s*/, ""));
      } else if (trimmed.startsWith("개선")) {
        cons.push(trimmed.replace(/^개선\s*:\s*/, ""));
      } else {
        others.push(trimmed);
      }
    });

    return { pros, cons, others };
  }, [evaluation]);

  useEffect(() => {
    if (evaluation) {
      toast.dismiss();
      toast.success("평가가 완료되었습니다.");
    }
  }, [evaluation]);

  if (!hasResult) {
    return (
      <section className={styles.container} aria-label="README 평가 결과">
        <div className={styles.header}>
          <h2 className={styles.title}>Evaluation</h2>
          <span className={styles.badge}>대기 중</span>
        </div>
        <p className={styles.empty}>
          아직 평가 결과가 없습니다. 상단의 <strong>README 평가</strong> 버튼을
          눌러 평가를 실행해 보세요.
        </p>
      </section>
    );
  }

  return (
    <section className={styles.container} aria-label="README 평가 결과">
      {hasResult && (
        <>
          <div className={styles.header}>
            <h2 className={styles.title}>README 평가 결과</h2>
            <span className={ratingBadgeClassName}>{ratingBadgeText}</span>
          </div>
          <div className={styles.rating}>
            <span className={`${styles.score} ${ratingBadgeClassName}`}>
              {evaluation?.rating}
            </span>
            <span className={styles.max}>/ 5.0</span>
          </div>
        </>
      )}

      {(pros.length > 0 || cons.length > 0 || others.length > 0) && (
        <div className={styles.sections}>
          {pros.length > 0 && (
            <section className={styles.sectionGroup} aria-label="장점">
              <p
                className={`${styles.sectionTitle} ${styles.sectionTitlePositive}`}
              >
                장점
              </p>
              <ul className={styles.list}>
                {pros.map((line, index) => (
                  <li key={`pro-${index}`}>{line}</li>
                ))}
              </ul>
            </section>
          )}

          {cons.length > 0 && (
            <section className={styles.sectionGroup} aria-label="개선 사항">
              <p
                className={`${styles.sectionTitle} ${styles.sectionTitleNegative}`}
              >
                개선
              </p>
              <ul className={styles.list}>
                {cons.map((line, index) => (
                  <li key={`con-${index}`}>{line}</li>
                ))}
              </ul>
            </section>
          )}

          {others.length > 0 && (
            <section className={styles.sectionGroup} aria-label="기타 코멘트">
              <p className={styles.sectionTitle}>기타</p>
              <ul className={styles.list}>
                {others.map((line, index) => (
                  <li key={`other-${index}`}>{line}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </section>
  );
};

export default EvaluationResult;
