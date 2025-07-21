import { act } from "@testing-library/react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TransactionView } from "./TransactionView";

const mockFetchTransactions = vi.fn();

vi.mock("../../services/ynab-api", () => ({
  fetchTransactions: (...args: unknown[]) => mockFetchTransactions(...args),
}));

const token = "test-token";
const budgetId = "budget-1";
const categoryId = "cat-1";

const transactions = [
  {
    id: "tx-1",
    date: "2025-07-01",
    amount: 12345,
    memo: "Groceries",
    cleared: "cleared",
    approved: true,
    account_id: "acc-1",
    category_id: categoryId,
    deleted: false,
  },
  {
    id: "tx-2",
    date: "2025-07-02",
    amount: 6789,
    memo: "Coffee",
    cleared: "uncleared",
    approved: false,
    account_id: "acc-1",
    category_id: categoryId,
    deleted: false,
  },
];

describe("TransactionView", () => {
  beforeEach(() => {
    mockFetchTransactions.mockReset();
  });

  it("renders transactions and paging controls", async () => {
    mockFetchTransactions.mockResolvedValue({
      transactions,
      total: 2,
    });

    render(<TransactionView token={token} budgetId={budgetId} categoryId={categoryId} />);

    await waitFor(() => {
      expect(screen.getByText("Groceries")).toBeInTheDocument();
      expect(screen.getByText("Coffee")).toBeInTheDocument();
      expect(screen.getByText("Page 1 of 1")).toBeInTheDocument();
    });
  });

  it("handles paging", async () => {
    // Initial load: pageSize=25, page=1
    mockFetchTransactions.mockResolvedValueOnce({
      transactions: [transactions[0], transactions[1]],
      total: 2,
    });
    // After pageSize change: pageSize=1, page=1
    mockFetchTransactions.mockResolvedValueOnce({
      transactions: [transactions[0]],
      total: 2,
    });
    // After clicking Next: pageSize=1, page=2
    mockFetchTransactions.mockResolvedValueOnce({
      transactions: [transactions[1]],
      total: 2,
    });
    // After clicking Previous: pageSize=1, page=1
    mockFetchTransactions.mockResolvedValueOnce({
      transactions: [transactions[0]],
      total: 2,
    });

    render(<TransactionView token={token} budgetId={budgetId} categoryId={categoryId} />);
    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByText("Groceries")).toBeInTheDocument();
    });

    // Set pageSize=1 to force two pages
    await act(async () => {
      fireEvent.change(screen.getByLabelText(/Page Size/i), { target: { value: "1" } });
    });

    await waitFor(() => {
      expect(screen.getByText("Groceries")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Next"));
    });

    await waitFor(() => {
      expect(screen.getByText("Coffee")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText("Previous"));
    });

    await waitFor(() => {
      expect(screen.getByText("Groceries")).toBeInTheDocument();
    });
  });

  it("handles error state", async () => {
    mockFetchTransactions.mockRejectedValue(new Error("API error"));

    render(<TransactionView token={token} budgetId={budgetId} categoryId={categoryId} />);

    await waitFor(() => {
      expect(screen.getByText("API error")).toBeInTheDocument();
    });
  });
});
