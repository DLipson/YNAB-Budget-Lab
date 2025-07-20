// src/hooks/useCategoryFilter.ts

import { useMemo } from "react";
import type { Category } from "../types/ynab";

export interface CategoryFilterState {
  [key: string]: string | number | boolean;
}

export interface CategorySortState {
  key: string;
  direction: "asc" | "desc";
}

interface UseCategoryFilterParams {
  categories: Category[];
  filterState?: CategoryFilterState;
  sortState?: CategorySortState;
}

/**
 * Filters and sorts category data using simple AND logic for filters.
 * Expensive operations are memoized.
 */
export function useCategoryFilter({ categories, filterState, sortState }: UseCategoryFilterParams): Category[] {
  return useMemo(() => {
    let filtered = categories;

    // Apply filters (AND logic)
    if (filterState) {
      filtered = filtered.filter((cat) => Object.entries(filterState).every(([key, value]) => cat[key] === value));
    }

    // Apply sorting
    if (sortState && sortState.key) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortState.key];
        const bVal = b[sortState.key];

        if (aVal === bVal) return 0;

        // Type guard for number or string comparison
        if (
          (typeof aVal === "number" && typeof bVal === "number") ||
          (typeof aVal === "string" && typeof bVal === "string")
        ) {
          if (sortState.direction === "asc") {
            return aVal > bVal ? 1 : -1;
          } else {
            return aVal < bVal ? 1 : -1;
          }
        }

        // Fallback: compare as strings
        const aStr = String(aVal);
        const bStr = String(bVal);
        if (sortState.direction === "asc") {
          return aStr > bStr ? 1 : -1;
        } else {
          return aStr < bStr ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [categories, filterState, sortState]);
}
