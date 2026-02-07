import { useState, useMemo } from "react";

import styles from "./EvaluationButton.module.scss";

import evaluation from "@assets/images/evaluation.svg";

import { useSection } from "@src/hooks/useSection";
import { useBranch } from "@src/hooks/useBranch";

import LoadingButton from "@src/components/common/LoadingButton";
import WarningModal from "@src/components/repo/WarningModal";

const EvaluationButton = () => {
  const { fullContent } = useSection();
  const { initialBranch } = useBranch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const effectiveBranch = useMemo(() => {
    return selectedBranch || initialBranch;
  }, [selectedBranch, initialBranch]);

  const handleCancel = () => {
    setIsLoading(false);
  };

  const handleEvaluation = () => {
    setIsLoading(true);
  };

  const handleConfirm = () => {
    setIsLoading(false);
    console.log(fullContent, effectiveBranch);
  };

  const handleSelectBranch = (branch: string) => {
    setSelectedBranch(branch);
  };

  return (
    <>
      <WarningModal
        isOpen={isLoading}
        onRequestClose={handleCancel}
        title="README 평가"
        description={
          <>
            <p>
              현재 작성한 README.md를 평가하며, 프로젝트의 커밋 내역, 코드,
              구조, 언어 등 여러 가지 정보를 참고하여 만들어집니다.
            </p>
            <p>
              반드시, 생성 전 프로젝트의{" "}
              <span className={styles.emphasisText}>민감한 정보</span> (API Key,
              .env 파일 등)를 제거해주세요.
            </p>
          </>
        }
        cancelButtonText="취소"
        confirmButtonText="평가 시작"
        initialBranch={effectiveBranch}
        onSelectBranch={handleSelectBranch}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
      <LoadingButton
        onClick={handleEvaluation}
        isLoading={isLoading}
        className={styles.evaluationBtn}
      >
        <img src={evaluation} alt="evaluation" />
        README 평가
      </LoadingButton>
    </>
  );
};

export default EvaluationButton;
