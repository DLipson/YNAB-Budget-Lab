// src/hooks/useCategoryFilter.ts

import { useMemo } from "react";

export interface Category {
  id: string;
  name: string;
  [key: string]: any;
}

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
        if (sortState.direction === "asc") {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [categories, filterState, sortState]);
}
