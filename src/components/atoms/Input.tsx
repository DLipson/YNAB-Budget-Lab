import React from "react";
import { Input as BaseInput } from "baseui/input";

type InputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  placeholder?: string;
  className?: string;
};

const Input: React.FC<InputProps> = ({ value, onChange, type = "text", placeholder, className }) => (
  <BaseInput
    value={value}
    onChange={onChange}
    type={type}
    placeholder={placeholder}
    overrides={className ? { Input: { props: { className } } } : {}}
  />
);

export default Input;
