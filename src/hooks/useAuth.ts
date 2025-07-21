// src/hooks/useAuth.ts

import { useState, useCallback } from "react";

type UseAuthReturn = {
  token: string;
  setToken: (key: string) => void;
  isValid: boolean;
  validateApiKey: (key?: string) => boolean;
  isAuthenticated: boolean;
};

const API_KEY_REGEX = /^[a-zA-Z0-9_-]{32,64}$/;

export function useAuth(): UseAuthReturn & { error?: string } {
  const [token, setToken] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const validateApiKey = useCallback(
    (key?: string) => {
      const value = key ?? token;
      const valid = API_KEY_REGEX.test(value);
      setIsValid(valid);
      if (!valid && value) {
        setError("Invalid API key format");
      } else {
        setError(undefined);
      }
      return valid;
    },
    [token]
  );

  const isAuthenticated = isValid && !!token;

  return {
    token,
    setToken: (key: string) => {
      setToken(key);
      validateApiKey(key);
    },
    isValid,
    validateApiKey,
    isAuthenticated,
    error,
  };
}
