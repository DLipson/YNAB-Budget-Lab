// src/hooks/useCategoryFilter.test.ts
import { render } from "@testing-library/react";
import { useCategoryFilter } from "./useCategoryFilter";
import type { Category } from "../types/ynab";

function TestHook<T>(props: { hook: () => T; onResult: (result: T) => void }) {
  const result = props.hook();
  props.onResult(result);
  return <></>;
}

function runHook<T>(hook: () => T) {
  let hookResult: T | undefined;
  render(
    <TestHook
      hook={hook}
      onResult={(r) => {
        hookResult = r;
      }}
    />
  );
  return hookResult!;
}

const categories: Category[] = [
  {
    id: "1",
    name: "Groceries",
    category_group_id: "g1",
    category_group_name: "Monthly:High:Expense",
    budgeted: 100,
    activity: 50,
    balance: 50,
  },
  {
    id: "2",
    name: "Rent",
    category_group_id: "g2",
    category_group_name: "Monthly:High:Expense",
    budgeted: 1000,
    activity: 1000,
    balance: 0,
  },
  {
    id: "3",
    name: "Utilities",
    category_group_id: "g1",
    category_group_name: "Monthly:Medium:Expense",
    budgeted: 200,
    activity: 150,
    balance: 50,
  },
  {
    id: "4",
    name: "Fun",
    category_group_id: "g3",
    category_group_name: "Monthly:Low:Expense",
    budgeted: 150,
    activity: 50,
    balance: 100,
  },
];

describe("useCategoryFilter", () => {
  it("returns all categories when no filter or sort", () => {
    const result = runHook(() => useCategoryFilter({ categories }));
    expect(result).toHaveLength(4);
  });

  it("filters by single field", () => {
    const result = runHook(() => useCategoryFilter({ categories, filterState: { category_group_id: "g1" } }));
    expect(result.map((c) => c.name)).toEqual(["Groceries", "Utilities"]);
  });

  it("filters by multiple fields (AND logic)", () => {
    const result = runHook(() =>
      useCategoryFilter({ categories, filterState: { category_group_id: "g1", balance: 50 } })
    );
    expect(result.map((c) => c.name)).toEqual(["Groceries", "Utilities"]);
  });

  it("returns empty array if no match", () => {
    const result = runHook(() => useCategoryFilter({ categories, filterState: { name: "Nonexistent" } }));
    expect(result).toEqual([]);
  });

  it("sorts by string field ascending", () => {
    const result = runHook(() => useCategoryFilter({ categories, sortState: { key: "name", direction: "asc" } }));
    expect(result.map((c) => c.name)).toEqual(["Fun", "Groceries", "Rent", "Utilities"]);
  });

  it("sorts by string field descending", () => {
    const result = runHook(() => useCategoryFilter({ categories, sortState: { key: "name", direction: "desc" } }));
    expect(result.map((c) => c.name)).toEqual(["Utilities", "Rent", "Groceries", "Fun"]);
  });

  it("sorts by number field ascending", () => {
    const result = runHook(() => useCategoryFilter({ categories, sortState: { key: "budgeted", direction: "asc" } }));
    expect(result.map((c) => c.name)).toEqual(["Groceries", "Fun", "Utilities", "Rent"]);
  });

  it("sorts by number field descending", () => {
    const result = runHook(() => useCategoryFilter({ categories, sortState: { key: "budgeted", direction: "desc" } }));
    expect(result.map((c) => c.name)).toEqual(["Rent", "Utilities", "Fun", "Groceries"]);
  });

  it("handles empty categories array", () => {
    const result = runHook(() => useCategoryFilter({ categories: [] }));
    expect(result).toEqual([]);
  });

  it("ignores unknown filter keys", () => {
    const result = runHook(() => useCategoryFilter({ categories, filterState: { unknown: "value" } }));
    expect(result).toEqual([]);
  });

  it("handles mixed type sorting fallback", () => {
    const mixed: Category[] = [
      {
        id: "1",
        name: "A",
        value: 2,
        category_group_id: "g1",
        category_group_name: "Monthly:High:Expense",
        budgeted: 0,
        activity: 0,
        balance: 0,
      },
      {
        id: "2",
        name: "B",
        value: "2",
        category_group_id: "g1",
        category_group_name: "Monthly:High:Expense",
        budgeted: 0,
        activity: 0,
        balance: 0,
      },
      {
        id: "3",
        name: "C",
        value: 1,
        category_group_id: "g1",
        category_group_name: "Monthly:High:Expense",
        budgeted: 0,
        activity: 0,
        balance: 0,
      },
    ];
    const result = runHook(() =>
      useCategoryFilter({ categories: mixed, sortState: { key: "value", direction: "asc" } })
    );
    expect(result.map((c) => c.id)).toEqual(["3", "2", "1"]);
  });
});
