import React, { useState } from "react";
import Input from "../atoms/Input";
import Button from "../atoms/Button";

type ApiKeyInputProps = {
  onSubmit: (apiKey: string) => void;
};

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onSubmit }) => {
  const [apiKey, setApiKey] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(apiKey);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input value={apiKey} onChange={handleChange} type="text" placeholder="Enter API key" />
      <Button type="submit" disabled={!apiKey}>
        Submit
      </Button>
    </form>
  );
};

export default ApiKeyInput;
