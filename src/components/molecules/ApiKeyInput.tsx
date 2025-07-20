import React, { useState } from "react";
import { Input } from "baseui/input";
import { Button } from "baseui/button";
import { Block } from "baseui/block";

type ApiKeyInputProps = {
  onSubmit: (apiKey: string) => void;
};

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onSubmit }) => {
  const [apiKey, setApiKey] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setApiKey(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(apiKey);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Block display="flex" flexDirection="column">
        <Input
          value={apiKey}
          onChange={handleChange}
          placeholder="Enter API key"
          clearable
          overrides={{
            Root: { style: { marginBottom: "16px" } },
          }}
        />
        <Button type="submit" disabled={!apiKey}>
          Submit
        </Button>
      </Block>
    </form>
  );
};

export default ApiKeyInput;
