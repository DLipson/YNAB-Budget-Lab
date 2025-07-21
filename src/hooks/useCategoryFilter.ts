import { useMemo } from "react";
import type { Category } from "../types/ynab";
import { parseCategoryGroupName } from "../utils/categoryParser";

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
    let filtered = categories ?? [];

    if (filterState) {
      filtered = filtered.filter((cat) =>
        Object.entries(filterState).every(([key, value]) => {
          if (key === "frequency" || key === "priority" || key === "type") {
            const parsed = parseCategoryGroupName(cat.category_group_name);
            // Exclude malformed/non-segmented group names from segment filtering
            if (!parsed.frequency || !parsed.priority || !parsed.type) return false;
            return parsed[key] === value;
          }
          return cat[key] === value;
        })
      );
    }

    if (sortState && sortState.key) {
      filtered = [...filtered].sort((a, b) => {
        let aVal = a[sortState.key];
        let bVal = b[sortState.key];

        if (sortState.key === "frequency" || sortState.key === "priority" || sortState.key === "type") {
          if (sortState.key === "frequency" || sortState.key === "priority" || sortState.key === "type") {
            const aParsed = parseCategoryGroupName(a.category_group_name);
            const bParsed = parseCategoryGroupName(b.category_group_name);
            // Exclude malformed/non-segmented group names from segment sorting
            if (!aParsed.frequency || !aParsed.priority || !aParsed.type) return 1;
            if (!bParsed.frequency || !bParsed.priority || !bParsed.type) return -1;
            aVal = aParsed[sortState.key];
            bVal = bParsed[sortState.key];
          }
        }

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
