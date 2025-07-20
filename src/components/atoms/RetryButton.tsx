import React from "react";

interface RetryButtonProps {
  onClick?: () => void;
}

export function RetryButton({ onClick }: RetryButtonProps) {
  return (
    <button
      style={{
        marginTop: "0.5rem",
        padding: "0.5rem 1rem",
        background: "#e53e3e",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
      onClick={onClick}
      data-testid="retry-button"
    >
      Retry
    </button>
  );
}
