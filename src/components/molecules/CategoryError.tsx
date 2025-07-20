import React from "react";
import { RetryButton } from "../atoms/RetryButton";

interface CategoryErrorProps {
  error: string;
  onRetry?: () => void;
}

export function CategoryError({ error, onRetry }: CategoryErrorProps) {
  return (
    <div style={{ color: "red", padding: "1rem" }}>
      Error loading categories: {error}
      <br />
      <RetryButton onClick={onRetry} />
    </div>
  );
}
