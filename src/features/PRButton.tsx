import { useState, useMemo } from "react";

import styles from "./PRButton.module.scss";

import arrowUp from "@assets/images/arrow-up.svg";

import { useBranch } from "@src/hooks/useBranch";

import LoadingButton from "@src/components/common/LoadingButton";
import WarningModal from "@src/components/repo/WarningModal";

const PRButton = () => {
  const { initialBranch } = useBranch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedBranch, setSelectedBranch] = useState<string>("");
  const effectiveBranch = useMemo(() => {
    return selectedBranch || initialBranch;
  }, [selectedBranch, initialBranch]);

  const handlePR = () => {
    setIsLoading(true);
  };

  const handleCancel = () => {
    setIsLoading(false);
  };

  const handleSelectBranch = (branch: string) => {
    setSelectedBranch(branch);
  };

  const handleConfirm = () => {
    setIsLoading(false);
    console.log(effectiveBranch);
  };

  return (
    <>
      <WarningModal
        isOpen={isLoading}
        onRequestClose={handleCancel}
        title="PR 생성"
        description={<p>PR을 생성할 브랜치를 선택해주세요.</p>}
        cancelButtonText="취소"
        confirmButtonText="PR 생성"
        initialBranch={effectiveBranch}
        onSelectBranch={handleSelectBranch}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
      <LoadingButton
        onClick={handlePR}
        isLoading={isLoading}
        className={styles.prBtn}
      >
        <img src={arrowUp} alt="arrow up" />
        PR 생성
      </LoadingButton>
    </>
  );
};

export default PRButton;
