import * as React from "react";
import { Button as BaseUIButton } from "baseui/button";
import type { ButtonProps as BaseUIButtonProps } from "baseui/button";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: BaseUIButtonProps["onClick"];
  type?: BaseUIButtonProps["type"];
  disabled?: BaseUIButtonProps["disabled"];
};

const Button: React.FC<ButtonProps> = ({ children, onClick, type = "button", disabled = false }) => (
  <BaseUIButton onClick={onClick} type={type} disabled={disabled}>
    {children}
  </BaseUIButton>
);

export default Button;
