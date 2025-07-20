// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, beforeEach, vi } from "vitest";
import { useBudgets } from "./useBudgets";
import * as ynabApi from "../services/ynab-api";

function TestComponent() {
  const { budgets, loading, error } = useBudgets();
  return (
    <div>
      <div data-testid="loading">{loading ? "true" : "false"}</div>
      <div data-testid="error">{error || ""}</div>
      <div data-testid="budgets">{JSON.stringify(budgets)}</div>
    </div>
  );
}

describe("useBudgets", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("handles loading state", async () => {
    vi.spyOn(ynabApi, "ynabFetch").mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ data: { budgets: [] } }), 50))
    );
    render(<TestComponent />);
    expect(screen.getByTestId("loading").textContent).toBe("true");
    await waitFor(() => expect(screen.getByTestId("loading").textContent).toBe("false"));
    expect(screen.getByTestId("budgets").textContent).toBe("[]");
    expect(screen.getByTestId("error").textContent).toBe("");
  });

  it("handles error state", async () => {
    vi.spyOn(ynabApi, "ynabFetch").mockImplementation(() => Promise.reject(new Error("API error")));
    render(<TestComponent />);
    await waitFor(() => expect(screen.getByTestId("loading").textContent).toBe("false"));
    expect(screen.getByTestId("error").textContent).toBe("API error");
    expect(screen.getByTestId("budgets").textContent).toBe("[]");
  });
});
