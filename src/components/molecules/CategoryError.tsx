import styles from "./CategoryError.module.css";
import { RetryButton } from "../atoms/RetryButton";

interface CategoryErrorProps {
  error: string;
  onRetry?: () => void;
}

export function CategoryError({ error, onRetry }: CategoryErrorProps) {
  return (
    <div className={styles.errorContainer}>
      Error loading categories: {error}
      <br />
      <RetryButton onClick={onRetry} />
    </div>
  );
}
