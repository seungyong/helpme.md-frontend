import styles from "./ResetButton.module.scss";

import reset from "@assets/images/reset.svg";

import { useSection } from "@src/hooks/useSection";

import LoadingButton from "@src/components/common/LoadingButton";

const ResetButton = () => {
  const { resetSection, isLoading } = useSection();

  const handleResetSection = () => {
    resetSection("split");
  };

  return (
    <LoadingButton
      onClick={handleResetSection}
      isLoading={isLoading}
      className={styles.resetBtn}
    >
      <img src={reset} alt="reset" />
      README 초기화
    </LoadingButton>
  );
};

export default ResetButton;
