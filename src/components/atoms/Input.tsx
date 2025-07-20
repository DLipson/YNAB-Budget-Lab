// src/components/atoms/Input.tsx
import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, ...props }: InputProps) {
  return (
    <label style={{ display: "block", marginBottom: 8 }}>
      {label && <span style={{ marginRight: 8 }}>{label}</span>}
      <input {...props} style={{ padding: 8, fontSize: 16, width: "100%" }} />
    </label>
  );
}
