import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TransactionView } from "./TransactionView";

const mockFetchTransactions = jest.fn();

jest.mock("../../services/ynab-api", () => ({
  fetchTransactions: (...args: any[]) => mockFetchTransactions(...args),
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
    mockFetchTransactions.mockResolvedValueOnce({
      transactions: [transactions[0]],
      total: 2,
    });
    mockFetchTransactions.mockResolvedValueOnce({
      transactions: [transactions[1]],
      total: 2,
    });

    render(<TransactionView token={token} budgetId={budgetId} categoryId={categoryId} />);

    await waitFor(() => {
      expect(screen.getByText("Groceries")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Next"));

    await waitFor(() => {
      expect(screen.getByText("Coffee")).toBeInTheDocument();
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
