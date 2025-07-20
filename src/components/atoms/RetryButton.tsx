import React from "react";
import styles from "./RetryButton.module.css";

interface RetryButtonProps {
  onClick?: () => void;
}

export function RetryButton({ onClick }: RetryButtonProps) {
  return (
    <button className={styles.retryButton} onClick={onClick} data-testid="retry-button">
      Retry
    </button>
  );
}
