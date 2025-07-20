import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({ children, onClick, type = "button", disabled = false }) => (
  <button type={type} onClick={onClick} disabled={disabled}>
    {children}
  </button>
);

export default Button;
