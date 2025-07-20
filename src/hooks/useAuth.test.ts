import { renderHook, act } from "@testing-library/react";
import { useAuth } from "./useAuth";

describe("useAuth", () => {
  it("should start unauthenticated with empty apiKey", () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.apiKey).toBe("");
    expect(result.current.isValid).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it("should validate a correct API key", async () => {
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      result.current.setApiKey("abcdefghijklmnopqrstuvwxyzABCDEF1234567890abcd");
    });
    expect(result.current.apiKey).toBe("abcdefghijklmnopqrstuvwxyzABCDEF1234567890abcd");
    expect(result.current.isValid).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.error).toBeUndefined();
  });

  it("should handle invalid API key format", async () => {
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      result.current.setApiKey("bad-key");
    });
    expect(result.current.apiKey).toBe("bad-key");
    expect(result.current.isValid).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBe("Invalid API key format");
  });

  it("validateApiKey returns correct validity", async () => {
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      result.current.setApiKey("bad-key");
    });
    expect(result.current.validateApiKey()).toBe(false);
    await act(async () => {
      result.current.setApiKey("abcdefghijklmnopqrstuvwxyzABCDEF1234567890abcd");
    });
    expect(result.current.validateApiKey()).toBe(true);
  });
});
