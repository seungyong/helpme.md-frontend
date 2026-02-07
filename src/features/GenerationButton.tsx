import { useState, useMemo } from "react";

import styles from "./GenerationButton.module.scss";

import generate from "@assets/images/generate.svg";

import { useBranch } from "@src/hooks/useBranch";

import LoadingButton from "@src/components/common/LoadingButton";
import WarningModal from "@src/components/repo/WarningModal";

const GenerationButton = () => {
  const { initialBranch } = useBranch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const effectiveBranch = useMemo(() => {
    return selectedBranch || initialBranch;
  }, [selectedBranch, initialBranch]);

  const handleGeneration = () => {
    setIsLoading(true);
  };

  const handleCancel = () => {
    setIsLoading(false);
  };

  const handleConfirm = () => {
    setIsLoading(false);
    console.log(effectiveBranch);
  };

  const handleSelectBranch = (branch: string) => {
    setSelectedBranch(branch);
  };

  return (
    <>
      <WarningModal
        isOpen={isLoading}
        onRequestClose={handleCancel}
        title="AI 초안 생성"
        description={
          <p>
            AI를 활용한 README 초안 생성은 프로젝트의 커밋 내역, 코드, 구조,
            언어 등 여러 가지 정보를 참고하여 만들어집니다.
          </p>
        }
        cancelButtonText="취소"
        confirmButtonText="생성 시작"
        initialBranch={effectiveBranch}
        onSelectBranch={handleSelectBranch}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
      <LoadingButton
        onClick={handleGeneration}
        isLoading={isLoading}
        className={styles.generationBtn}
      >
        <img src={generate} alt="generation" />
        AI 초안 생성
      </LoadingButton>
    </>
  );
};

export default GenerationButton;
