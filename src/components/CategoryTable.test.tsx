import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CategoryTable } from "./CategoryTable";

describe("CategoryTable", () => {
  const categories = [
    {
      id: "1",
      name: "Groceries",
      category_group_id: "cg1",
      category_group_name: "Monthly:High:Expense",
      budgeted: 100,
      activity: -80,
      balance: 20,
      frequency: "Monthly",
      priority: "High",
      type: "Expense",
    },
    {
      id: "2",
      name: "Salary",
      category_group_id: "cg2",
      category_group_name: "Monthly:Medium:Income",
      budgeted: 2000,
      activity: 2000,
      balance: 0,
      frequency: "Monthly",
      priority: "Medium",
      type: "Income",
    },
  ];

  it("renders all columns", () => {
    render(<CategoryTable categories={categories} />);
    expect(screen.getByText("Category Name")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByText("Frequency")).toBeInTheDocument();
    expect(screen.getByText("Priority")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
  });

  it("renders category rows", () => {
    render(<CategoryTable categories={categories} />);
    expect(screen.getByText("Groceries")).toBeInTheDocument();
    expect(screen.getByText("Salary")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("2000")).toBeInTheDocument();
    expect(screen.getByText("Expense")).toBeInTheDocument();
    expect(screen.getByText("Income")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    const { container } = render(<CategoryTable categories={[]} isLoading />);
    expect(container.querySelectorAll(".baseui-skeleton").length).toBeGreaterThan(0);
  });

  it("shows error state", () => {
    render(<CategoryTable categories={[]} error="Network error" />);
    expect(screen.getByText(/Error loading categories/i)).toBeInTheDocument();
    expect(screen.getByText(/Network error/i)).toBeInTheDocument();
  });

  it("shows empty state", () => {
    render(<CategoryTable categories={[]} />);
    expect(screen.getByText(/no categories|empty|no data|no items/i)).toBeInTheDocument();
  });
});

// Loading skeleton test
it("shows loading skeletons when isLoading is true", () => {
  render(<CategoryTable categories={[]} isLoading />);
  expect(screen.getAllByRole("row")).toHaveLength(6); // 1 header + 5 skeleton rows
  expect(screen.getAllByText((content, element) => element.className.includes("baseui-skeleton"))).not.toHaveLength(0);
});

// Empty state test
it("shows empty state when categories is empty", () => {
  render(<CategoryTable categories={[]} />);
  expect(screen.getByText("No categories available.")).toBeInTheDocument();
});

// Empty state with filter
it("shows filtered empty state when filterActive is true", () => {
  render(<CategoryTable categories={[]} filterActive />);
  expect(screen.getByText("No categories match your filter.")).toBeInTheDocument();
});

// Retry logic test
it("shows error and retry button when error is present", () => {
  const onRetry = vi.fn();
  render(<CategoryTable categories={[]} error="Network error" onRetry={onRetry} />);
  expect(screen.getByText("Error loading categories: Network error")).toBeInTheDocument();
  const retryBtn = screen.getByText("Retry");
  expect(retryBtn).toBeInTheDocument();
  retryBtn.click();
  expect(onRetry).toHaveBeenCalled();
});

// Mobile responsiveness test
it("renders correctly on mobile viewport", () => {
  window.innerWidth = 375;
  window.dispatchEvent(new Event("resize"));
  render(
    <CategoryTable
      categories={[
        {
          id: "1",
          name: "Mobile",
          category_group_id: "cg1",
          category_group_name: "Monthly:Low:Expense",
          budgeted: 10,
          activity: 0,
          balance: 10,
          frequency: "Monthly",
          priority: "Low",
          type: "Expense",
        },
      ]}
    />
  );
  expect(screen.getByText("Mobile")).toBeInTheDocument();
  // Optionally check for mobile-specific styles or layout if implemented
});
