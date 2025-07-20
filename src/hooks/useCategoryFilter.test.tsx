// src/hooks/useCategoryFilter.test.ts
import { renderHook } from "@testing-library/react-hooks";
import { useCategoryFilter } from "./useCategoryFilter";
import type { Category } from "../types/ynab";

const categories: Category[] = [
  { id: "1", name: "Groceries", category_group_id: "g1", budgeted: 100, activity: 50, balance: 50 },
  { id: "2", name: "Rent", category_group_id: "g2", budgeted: 1000, activity: 1000, balance: 0 },
  { id: "3", name: "Utilities", category_group_id: "g1", budgeted: 200, activity: 150, balance: 50 },
  { id: "4", name: "Fun", category_group_id: "g3", budgeted: 150, activity: 50, balance: 100 },
];

describe("useCategoryFilter", () => {
  it("returns all categories when no filter or sort", () => {
    const { result } = renderHook(() => useCategoryFilter({ categories }));
    expect(result.current).toHaveLength(4);
  });

  it("filters by single field", () => {
    const { result } = renderHook(() => useCategoryFilter({ categories, filterState: { category_group_id: "g1" } }));
    expect(result.current.map((c) => c.name)).toEqual(["Groceries", "Utilities"]);
  });

  it("filters by multiple fields (AND logic)", () => {
    const { result } = renderHook(() =>
      useCategoryFilter({ categories, filterState: { category_group_id: "g1", balance: 50 } })
    );
    expect(result.current.map((c) => c.name)).toEqual(["Groceries", "Utilities"]);
  });

  it("returns empty array if no match", () => {
    const { result } = renderHook(() => useCategoryFilter({ categories, filterState: { name: "Nonexistent" } }));
    expect(result.current).toEqual([]);
  });

  it("sorts by string field ascending", () => {
    const { result } = renderHook(() =>
      useCategoryFilter({ categories, sortState: { key: "name", direction: "asc" } })
    );
    expect(result.current.map((c) => c.name)).toEqual(["Fun", "Groceries", "Rent", "Utilities"]);
  });

  it("sorts by string field descending", () => {
    const { result } = renderHook(() =>
      useCategoryFilter({ categories, sortState: { key: "name", direction: "desc" } })
    );
    expect(result.current.map((c) => c.name)).toEqual(["Utilities", "Rent", "Groceries", "Fun"]);
  });

  it("sorts by number field ascending", () => {
    const { result } = renderHook(() =>
      useCategoryFilter({ categories, sortState: { key: "budgeted", direction: "asc" } })
    );
    expect(result.current.map((c) => c.name)).toEqual(["Groceries", "Fun", "Utilities", "Rent"]);
  });

  it("sorts by number field descending", () => {
    const { result } = renderHook(() =>
      useCategoryFilter({ categories, sortState: { key: "budgeted", direction: "desc" } })
    );
    expect(result.current.map((c) => c.name)).toEqual(["Rent", "Utilities", "Fun", "Groceries"]);
  });

  it("handles empty categories array", () => {
    const { result } = renderHook(() => useCategoryFilter({ categories: [] }));
    expect(result.current).toEqual([]);
  });

  it("ignores unknown filter keys", () => {
    const { result } = renderHook(() => useCategoryFilter({ categories, filterState: { unknown: "value" } }));
    expect(result.current).toEqual([]);
  });

  it("handles mixed type sorting fallback", () => {
    const mixed = [
      { id: "1", name: "A", value: 2 },
      { id: "2", name: "B", value: "2" },
      { id: "3", name: "C", value: 1 },
    ] as Category[];
    const { result } = renderHook(() =>
      useCategoryFilter({ categories: mixed, sortState: { key: "value", direction: "asc" } })
    );
    expect(result.current.map((c) => c.id)).toEqual(["3", "1", "2"]);
  });
});
