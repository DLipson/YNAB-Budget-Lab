import React from "react";

type InputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  className?: string;
};

const Input: React.FC<InputProps> = ({ value, onChange, type = "text", placeholder, className }) => (
  <input value={value} onChange={onChange} type={type} placeholder={placeholder} className={className} />
);

export default Input;
