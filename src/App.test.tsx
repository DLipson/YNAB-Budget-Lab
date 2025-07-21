import { render, screen, waitFor } from "@testing-library/react";
import * as useAuthModule from "./hooks/useAuth";
import App from "./App";

import type { CategoryGroup, Category, BudgetSummary } from "./types/ynab";

// Mock useAuth to control authentication state
function mockUseAuth(authState: Partial<ReturnType<typeof useAuthModule.useAuth>>) {
  vi.spyOn(useAuthModule, "useAuth").mockReturnValue({
    token: authState.token ?? "",
    setToken: authState.setToken ?? vi.fn(),
    isAuthenticated: !!authState.isAuthenticated,
    error: authState.error ?? undefined,
    isValid: authState.isValid ?? false,
    validateApiKey: authState.validateApiKey ?? vi.fn(),
  });
}

describe("App authentication UI", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders authentication UI when unauthenticated", () => {
    mockUseAuth({ isAuthenticated: false, setToken: vi.fn() });
    render(<App />);
    expect(screen.getByText(/Authenticate to Continue/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter API key/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("renders main app when authenticated", () => {
    mockUseAuth({ isAuthenticated: true, token: "validtoken" });
    render(<App />);
    // Should not show authentication heading
    expect(screen.queryByText(/Authenticate to Continue/i)).not.toBeInTheDocument();
    // Should show main app heading or controls
    expect(screen.getByText(/YNAB Budget Lab/i)).toBeInTheDocument();
  });
});

// Test: categories state is set after fetch
/* Test: categories state is set after fetch */
import * as ynabApi from "./services/ynab-api";

describe("App categories state", () => {
  it("sets categories after successful fetch", async () => {
    const mockApiResponse: {
      data: {
        category_groups: CategoryGroup[];
        server_knowledge: number;
      };
    } = {
      data: {
        category_groups: [
          {
            id: "group-1",
            name: "Group 1",
            hidden: false,
            deleted: false,
            categories: [
              {
                id: "cat-1",
                category_group_id: "group-1",
                category_group_name: "Group 1",
                name: "TestCat",
                budgeted: 100,
                activity: 0,
                balance: 100,
                hidden: false,
                deleted: false,
                // other fields omitted for brevity
              } as Category,
              {
                id: "cat-2",
                category_group_id: "group-1",
                category_group_name: "Group 1",
                name: "TestCat2",
                budgeted: 200,
                activity: 0,
                balance: 200,
                hidden: false,
                deleted: false,
              } as Category,
              {
                id: "cat-3",
                category_group_id: "group-1",
                category_group_name: "Group 1",
                name: "TestCat3",
                budgeted: 300,
                activity: 0,
                balance: 300,
                hidden: false,
                deleted: false,
              } as Category,
            ],
          },
        ],
        server_knowledge: 0,
      },
    };
    jest.spyOn(ynabApi, "fetchBudgets").mockResolvedValue([
      {
        id: "budget1",
        name: "Budget 1",
        last_modified_on: "2025-01-01",
        first_month: "2025-01",
        last_month: "2025-07",
      } as BudgetSummary,
    ]);
    jest
      .spyOn(ynabApi, "fetchCategories")
      .mockResolvedValue(mockApiResponse.data.category_groups.flatMap((g) => g.categories));

    render(<App />);
    await waitFor(() => {
      expect(screen.queryByText("TestCat")).toBeInTheDocument();
      expect(screen.queryByText("TestCat2")).toBeInTheDocument();
      expect(screen.queryByText("TestCat3")).toBeInTheDocument();
    });
  });
});
