import { useEffect } from "react";

import styles from "./Spinner.module.scss";

interface SpinnerProps {
  isLoading: boolean;
  message: string;
}

const Spinner = ({ isLoading, message }: SpinnerProps) => {
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div
      className={styles.overlay}
      role="status"
      aria-live="polite"
      aria-label="로딩 중"
    >
      <div className={styles.spinner} />
      <p className={styles.message}>{message}</p>
    </div>
  );
};

export default Spinner;
