import { ReactNode, useCallback } from "react";

import styles from "./WarningModal.module.scss";

import { useBranch } from "@src/hooks/useBranch";

import Modal from "@src/components/common/Modal";
import Select from "@src/components/common/Select";

interface WarningModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  title: string;
  description: ReactNode;
  cancelButtonText: string;
  confirmButtonText: string;
  /** 현재 선택된 브랜치(표시·전달용). useBranch의 effectiveBranch 권장 */
  initialBranch: string;
  onSelectBranch: (branch: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
  /** 브랜치 데이터 로드 완료 여부. false면 확인 버튼 비활성화 */
  isBranchReady?: boolean;
}

const WarningModal = ({
  isOpen,
  onRequestClose,
  title,
  description,
  cancelButtonText,
  confirmButtonText,
  initialBranch,
  onSelectBranch,
  onCancel,
  onConfirm,
}: WarningModalProps) => {
  const { branches, isSuccess } = useBranch();

  const handleChangeSelectBranch = useCallback(
    (value: string) => {
      onSelectBranch(value);
    },
    [onSelectBranch]
  );

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <div className={styles.modalContent}>
        <h2 className="text-emphasis-large">{title}</h2>
        <div className={`text-sub-color ${styles.descriptionText}`}>
          {description}
        </div>
        <Select
          options={
            branches?.map((branch) => ({
              label: branch,
              value: branch,
            })) || []
          }
          value={initialBranch}
          onChange={handleChangeSelectBranch}
          disabled={!isSuccess}
        />
        <div className={styles.btnGroup}>
          <button
            type="button"
            className={`${styles.btn} ${styles.cancelBtn}`}
            onClick={onCancel}
          >
            {cancelButtonText}
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.startBtn}`}
            onClick={onConfirm}
            disabled={!isSuccess}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default WarningModal;
