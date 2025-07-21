import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CategoryTable } from "./CategoryTable";
import { vi } from "vitest";

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
    expect(screen.getByText("Select")).toBeInTheDocument();
    expect(screen.getByText("Category Name")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
    expect(screen.getByText("Frequency")).toBeInTheDocument();
    expect(screen.getByText("Priority")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
  });

  it("renders checkboxes for each row", () => {
    render(<CategoryTable categories={categories} />);
    // There are now two checkboxes per row: select and scenario toggle
    expect(screen.getAllByRole("checkbox").length).toBe(categories.length * 2);
  });

  it("enables and disables Copy to Spreadsheet button", () => {
    render(<CategoryTable categories={categories} />);
    const button = screen.getByRole("button", { name: /Copy selected amounts to spreadsheet/i });
    expect(button).toBeDisabled();
    const checkboxes = screen.getAllByRole("checkbox");
    checkboxes[0].click();
    expect(button).not.toBeDisabled();
  });

  it("copies selected amounts as formula to clipboard", async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn(),
      },
    });
    render(<CategoryTable categories={categories} />);
    const checkboxes = screen.getAllByRole("checkbox");
    checkboxes[0].click();
    checkboxes[1].click();
    const button = screen.getByRole("button", { name: /Copy selected amounts to spreadsheet/i });
    // Enable scenario for both categories before copying
    const scenarioToggles = screen.getAllByLabelText(/Toggle scenario for/i);
    scenarioToggles.forEach((toggle) => {
      const input = toggle as HTMLInputElement;
      if (!input.checked) {
        input.click();
      }
    });
    // Enable scenario for both categories before copying
    scenarioToggles.forEach((toggle) => {
      const input = toggle as HTMLInputElement;
      if (!input.checked) {
        act(() => {
          input.click();
        });
        it("toggles scenario for all categories in a group", () => {
          render(<CategoryTable categories={categories} />);
          const groupToggle = screen.getByLabelText(/Toggle scenario for group Monthly:High:Expense/i);
          const scenarioToggles = screen
            .getAllByLabelText(/Toggle scenario for /i)
            .filter((el) => !el.getAttribute("aria-label")?.includes("group"));
          // Disable all in group
          act(() => {
            (groupToggle as HTMLInputElement).click();
          });
          scenarioToggles.forEach((toggle) => {
            expect((toggle as HTMLInputElement).checked).toBe(false);
          });
          // Enable all in group
          act(() => {
            (groupToggle as HTMLInputElement).click();
          });
          scenarioToggles.forEach((toggle) => {
            expect((toggle as HTMLInputElement).checked).toBe(true);
          });
        });

        it("adjusts variable category amount and updates total", () => {
          const variableCategory = {
            id: "3",
            name: "Dining Out",
            category_group_id: "cg1",
            category_group_name: "Monthly:High:Variable",
            budgeted: 50,
            activity: -30,
            balance: 20,
            frequency: "Monthly",
            priority: "High",
            type: "Variable",
          };
          render(<CategoryTable categories={[...categories, variableCategory]} />);
          const input = screen.getByLabelText("Adjust amount for Dining Out") as HTMLInputElement;
          act(() => {
            input.value = "75";
            input.dispatchEvent(new Event("input", { bubbles: true }));
            input.dispatchEvent(new Event("change", { bubbles: true }));
          });
          expect(input.value).toBe("75");
          expect(screen.getByText(/Total:/i)).toHaveTextContent("Total: 2175");
        });

        it("reset button restores defaults", () => {
          render(<CategoryTable categories={categories} />);
          const scenarioToggles = screen
            .getAllByLabelText(/Toggle scenario for /i)
            .filter((el) => !el.getAttribute("aria-label")?.includes("group"));
          act(() => {
            scenarioToggles.forEach((toggle) => {
              if ((toggle as HTMLInputElement).checked) {
                (toggle as HTMLInputElement).click();
              }
            });
          });
          const resetButton = screen.getByRole("button", { name: /Reset scenario planning/i });
          act(() => {
            resetButton.click();
          });
          scenarioToggles.forEach((toggle) => {
            expect((toggle as HTMLInputElement).checked).toBe(true);
          });
          expect(screen.getByText("100")).toBeInTheDocument();
          expect(screen.getByText("2000")).toBeInTheDocument();
        });

        it("real-time total updates when scenario toggles or adjustments change", () => {
          render(<CategoryTable categories={categories} />);
          const scenarioToggles = screen
            .getAllByLabelText(/Toggle scenario for /i)
            .filter((el) => !el.getAttribute("aria-label")?.includes("group"));
          // Disable first category
          act(() => {
            (scenarioToggles[0] as HTMLInputElement).click();
          });
          expect(screen.getByText(/Total:/i)).toHaveTextContent("Total: 2000");
          // Enable again
          act(() => {
            (scenarioToggles[0] as HTMLInputElement).click();
          });
          expect(screen.getByText(/Total:/i)).toHaveTextContent("Total: 2100");
        });
      }
    });
    button.click();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("=100 + 2000");
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

  it("toggles scenario for a category", () => {
    render(<CategoryTable categories={categories} />);
    const scenarioToggles = screen.getAllByLabelText(/Toggle scenario for/i);
    expect(scenarioToggles[0]).toBeChecked();
    scenarioToggles[0].click();
    expect(scenarioToggles[0]).not.toBeChecked();
  });

  it("adjusts variable category amount", () => {
    const variableCat = {
      ...categories[0],
      category_group_name: "Monthly:High:Variable",
      type: "Variable",
    };
    render(<CategoryTable categories={[variableCat]} />);
    const adjustInput = screen.getByLabelText(/Adjust amount for/i) as HTMLInputElement;
    expect(adjustInput).toHaveValue(100);
    act(() => {
      adjustInput.focus();
      adjustInput.value = "150";
      adjustInput.dispatchEvent(new Event("input", { bubbles: true }));
    });
    expect(adjustInput).toHaveValue(150);
  });

  it("shows real-time total calculation", () => {
    render(<CategoryTable categories={categories} />);
    expect(screen.getByText(/Total:/)).toHaveTextContent("Total: 2100");
  });

  it("resets scenario planning to defaults", () => {
    render(<CategoryTable categories={categories} />);
    const scenarioToggles = screen.getAllByLabelText(/Toggle scenario for/i);
    scenarioToggles[0].click();
    const resetButton = screen.getByRole("button", { name: /Reset scenario planning/i });
    act(() => {
      resetButton.click();
    });
    expect((scenarioToggles[0] as HTMLInputElement).checked).toBe(true);
  });
});

it("shows loading skeletons when isLoading is true", () => {
  render(<CategoryTable categories={[]} isLoading />);
  expect(screen.getAllByRole("row")).toHaveLength(6); // 1 header + 5 skeleton rows
  expect(
    screen.getAllByText((_, element) => !!element && element.className.includes("baseui-skeleton"))
  ).not.toHaveLength(0);
});

it("shows empty state when categories is empty", () => {
  render(<CategoryTable categories={[]} />);
  expect(screen.getByText("No categories available.")).toBeInTheDocument();
});

it("shows filtered empty state when filterActive is true", () => {
  render(<CategoryTable categories={[]} filterActive />);
  expect(screen.getByText("No categories match your filter.")).toBeInTheDocument();
});

it("shows error and retry button when error is present", () => {
  const onRetry = vi.fn();
  render(<CategoryTable categories={[]} error="Network error" onRetry={onRetry} />);
  expect(screen.getByText("Error loading categories: Network error")).toBeInTheDocument();
  const retryBtn = screen.getByText("Retry");
  expect(retryBtn).toBeInTheDocument();
  retryBtn.click();
  expect(onRetry).toHaveBeenCalled();
});

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
