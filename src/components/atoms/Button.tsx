// src/components/atoms/Button.tsx
import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      style={{
        padding: "8px 16px",
        fontSize: 16,
        background: "#1976d2",
        color: "#fff",
        border: "none",
        borderRadius: 4,
        cursor: "pointer",
        ...props.style,
      }}
    >
      {children}
    </button>
  );
}
