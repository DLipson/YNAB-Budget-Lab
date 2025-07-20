// src/hooks/useAuth.ts
import { useState } from "react";
import { ynabFetch } from "../services/ynab-api";
import type { YnabApiResponse } from "../types/ynab";

export function useAuth() {
  const [apiKey, setApiKey] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function validateApiKey(key: string) {
    setLoading(true);
    setError(null);
    try {
      // Validate by calling /user endpoint
      await ynabFetch<YnabApiResponse>("/user", {
        headers: { Authorization: `Bearer ${key}` },
      });
      setApiKey(key);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || "Invalid API key");
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setApiKey("");
    setIsAuthenticated(false);
    setError(null);
  }

  return {
    apiKey,
    isAuthenticated,
    loading,
    error,
    validateApiKey,
    logout,
  };
}
