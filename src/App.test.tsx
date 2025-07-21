import { render, screen } from "@testing-library/react";
import * as useAuthModule from "./hooks/useAuth";
import App from "./App";

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
