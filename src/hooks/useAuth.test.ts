import { renderHook, act } from "@testing-library/react";
import { useAuth } from "./useAuth";

describe("useAuth", () => {
  it("should start unauthenticated with empty token", () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.token).toBe("");
    expect(result.current.isValid).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it("should validate a correct token", async () => {
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      result.current.setToken("abcdefghijklmnopqrstuvwxyzABCDEF1234567890abcd");
    });
    expect(result.current.token).toBe("abcdefghijklmnopqrstuvwxyzABCDEF1234567890abcd");
    expect(result.current.isValid).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.error).toBeUndefined();
  });

  it("should handle invalid token format", async () => {
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      result.current.setToken("bad-key");
    });
    expect(result.current.token).toBe("bad-key");
    expect(result.current.isValid).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBe("Invalid API key format");
  });

  it("validateApiKey returns correct validity", async () => {
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      result.current.setToken("bad-key");
    });
    expect(result.current.validateApiKey()).toBe(false);
    await act(async () => {
      result.current.setToken("abcdefghijklmnopqrstuvwxyzABCDEF1234567890abcd");
    });
    expect(result.current.validateApiKey()).toBe(true);
  });
});
