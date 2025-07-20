// src/components/molecules/ApiKeyInput.tsx
import React, { useState } from "react";
import { Input } from "../atoms/Input";
import { Button } from "../atoms/Button";
import { useAuth } from "../../hooks/useAuth";

export function ApiKeyInput() {
  const { validateApiKey, loading, error, isAuthenticated } = useAuth();
  const [key, setKey] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    validateApiKey(key);
  }

  if (isAuthenticated) {
    return <div>Authenticated!</div>;
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "0 auto" }}>
      <Input
        label="YNAB API Key"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        disabled={loading}
        required
        type="text"
        autoFocus
      />
      <Button type="submit" disabled={loading || !key}>
        {loading ? "Validating..." : "Authenticate"}
      </Button>
      {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
    </form>
  );
}
