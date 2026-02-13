import React from "react";

import styles from "./Loadingbutton.module.scss";

interface LoadingButtonProps {
  onClick: () => void;
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const LoadingButton = ({
  onClick,
  isLoading,
  children,
  className = "",
  disabled = false,
}: LoadingButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`${styles.button} ${className}`}
    >
      <span
        className={styles.content}
        data-loading={isLoading}
        aria-hidden={isLoading}
      >
        {children}
      </span>
      {isLoading && (
        <span className={styles.spinnerWrap} aria-hidden>
          <span className={styles.spinner} />
        </span>
      )}
    </button>
  );
};

export default LoadingButton;
