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
