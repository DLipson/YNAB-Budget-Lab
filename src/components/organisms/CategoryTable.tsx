import { Table } from "baseui/table";
import { Block } from "baseui/block";
import { parseCategoryGroupName } from "../../utils/categoryParser";
import { CategoryTableSkeleton } from "../molecules/CategoryTableSkeleton";
import { CategoryError } from "../molecules/CategoryError";
import { CategoryEmptyState } from "../molecules/CategoryEmptyState";

import type { Category } from "../../types/ynab";

interface CategoryTableProps {
  categories: Category[];
  isLoading?: boolean;
  error?: string | null;
  filterActive?: boolean;
  onRetry?: () => void;
}

import React, { useState } from "react";

export function CategoryTable({
  categories,
  isLoading = false,
  error = null,
  filterActive = false,
  onRetry,
}: CategoryTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const columns = ["Select", "Category Name", "Amount", "Frequency", "Priority", "Type"];

  if (isLoading) {
    return <CategoryTableSkeleton columns={columns.slice(1)} />;
  }

  if (error) {
    return <CategoryError error={error} onRetry={onRetry} />;
  }

  if (categories.length === 0) {
    return <CategoryEmptyState filterActive={filterActive} />;
  }

  if (process.env.NODE_ENV === "development") {
    console.log(
      "[CategoryTable] Received categories:",
      Array.isArray(categories) ? categories.length : categories,
      categories
    );
  }

  const handleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const data = categories.map((category) => {
    const parsedGroup = parseCategoryGroupName(category.category_group_name ?? "");
    return [
      <input
        type="checkbox"
        checked={selectedIds.includes(category.id)}
        onChange={() => handleSelect(category.id)}
        aria-label={`Select ${category.name}`}
      />,
      <span>{String(category.name)}</span>,
      <span>{String(category.budgeted)}</span>,
      <span>{String(parsedGroup.frequency ?? category.frequency ?? "")}</span>,
      <span>{String(parsedGroup.priority ?? category.priority ?? "")}</span>,
      <span>{String(parsedGroup.type ?? category.type ?? "")}</span>,
    ];
  });

  return (
    <Block
      className="responsive-table"
      overrides={{
        Block: {
          style: {
            padding: "1rem",
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            overflowX: "auto",
          },
        },
      }}
    >
      <Table columns={columns} data={data} />
      <Block marginTop="scale600">
        <button
          type="button"
          disabled={selectedIds.length === 0}
          onClick={() => {
            const selectedAmounts = categories.filter((cat) => selectedIds.includes(cat.id)).map((cat) => cat.budgeted);
            if (selectedAmounts.length === 0) return;
            const formula = "=" + selectedAmounts.join(" + ");
            navigator.clipboard.writeText(formula);
          }}
          style={{
            padding: "0.5rem 1rem",
            background: "#276ef1",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: selectedIds.length === 0 ? "not-allowed" : "pointer",
            fontWeight: 500,
          }}
          aria-label="Copy selected amounts to spreadsheet"
        >
          Copy to Spreadsheet
        </button>
      </Block>
    </Block>
  );
}
