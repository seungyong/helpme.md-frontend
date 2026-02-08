import { useState, useMemo, useCallback } from "react";
import toast from "react-hot-toast";

import styles from "./InitSectionModal.module.scss";

import { InitSectionRequest } from "@src/types/request/repository";

import { useBranch } from "@src/hooks/useBranch";
import { useSection } from "@src/hooks/useSection";

import Modal from "@src/components/common/Modal";
import Select from "@src/components/common/Select";
import LoadingButton from "@src/components/common/LoadingButton";

interface InitSectionProps {
  isOpen: boolean;
  onComplete: () => void;
  onClose?: () => void;
}

interface SelectOption {
  label: string;
  value: string;
}

const InitSection = ({
  isOpen,
  onComplete,
  onClose = () => {},
}: InitSectionProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sectionMode = useMemo<SelectOption[]>(
    () => [
      {
        label: "분할 모드 (#, ## 제목)",
        value: "split",
      },
      {
        label: "전체 모드 (전체 내용)",
        value: "whole",
      },
    ],
    []
  );
  const [selectedMode, setSelectedMode] = useState<SelectOption>(
    sectionMode[0]
  );

  const { initSections } = useSection();
  const { branches, initialBranch, isSuccess } = useBranch();
  const [selectedBranch, setSelectedBranch] = useState<string>(initialBranch);

  const effectiveBranch = useMemo(() => {
    return selectedBranch || initialBranch;
  }, [selectedBranch, initialBranch]);

  const handleChangeSelectMode = useCallback(
    (value: string) => {
      setSelectedMode(
        sectionMode.find((mode) => mode.value === value) || sectionMode[0]
      );
    },
    [sectionMode]
  );

  const handleChangeSelectBranch = useCallback((value: string) => {
    setSelectedBranch(value);
  }, []);

  const handleCreateSection = useCallback(async () => {
    setIsLoading(true);

    initSections(
      {
        branch: effectiveBranch,
        splitMode: selectedMode.value as InitSectionRequest["splitMode"],
      },
      {
        onSuccess: () => {
          onComplete();
        },
        onError: () => {
          toast.error("섹션 생성에 실패했습니다.");
        },
      }
    );

    setIsLoading(false);
  }, [initSections, effectiveBranch, selectedMode.value, onComplete]);

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose}>
      <div className={styles.modalContent}>
        <div>
          <h2 className="text-emphasis">
            Branch 선택{" "}
            <span className="text-description text-sub-color">
              (README.md 기준 선택)
            </span>
          </h2>
          <Select
            options={
              branches?.map((branch) => ({
                label: branch,
                value: branch,
              })) || []
            }
            value={effectiveBranch}
            onChange={handleChangeSelectBranch}
            disabled={!isSuccess}
          />
        </div>
        <div>
          <h2 className="text-emphasis">분할 모드</h2>
          <Select
            options={sectionMode}
            value={selectedMode.value}
            onChange={handleChangeSelectMode}
          />
        </div>
        <LoadingButton
          onClick={handleCreateSection}
          isLoading={isLoading}
          disabled={!isSuccess}
          className={styles.btn}
        >
          섹션 생성
        </LoadingButton>
      </div>
    </Modal>
  );
};

export default InitSection;
