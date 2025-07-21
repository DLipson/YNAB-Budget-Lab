// src/services/ynab-api.test.ts

import { ynabFetch } from "./ynab-api";
import { vi, expect, describe, it, beforeEach, afterEach } from "vitest";

describe("ynabFetch authentication", () => {
  const endpoint = "/test-endpoint";
  const token = "test-api-key";

  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => ({ success: true }),
      text: async () => "",
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("uses the API key (token) for authentication", async () => {
    await ynabFetch(endpoint, {}, token);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${token}`,
        }),
      })
    );
  });

  it("fails if budgetId is used instead of API key in Authorization header (regression test)", async () => {
    const budgetId = "test-budget-id";
    await ynabFetch(endpoint, {}, budgetId);

    // This should fail: Authorization header must use API key, not budgetId
    expect(global.fetch).not.toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${budgetId}`,
        }),
      })
    );
  });
});
