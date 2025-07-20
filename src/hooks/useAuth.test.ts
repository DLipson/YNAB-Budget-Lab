// src/hooks/useAuth.test.ts
import { renderHook, act } from "@testing-library/react";
import { useAuth } from "./useAuth";

describe("useAuth", () => {
  it("should start unauthenticated", () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.apiKey).toBe("");
  });

  it("should set error for invalid API key", async () => {
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.validateApiKey("bad-key");
    });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBeTruthy();
  });
});
