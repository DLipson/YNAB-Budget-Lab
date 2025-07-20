import * as React from "react";
import { Table } from "baseui/table";
import { Skeleton } from "baseui/skeleton";
import { parseCategoryName } from "../utils/categoryParser";

import type { Category } from "../types/ynab";

interface CategoryTableProps {
  categories: Category[];
  isLoading?: boolean;
  error?: string | null;
  filterActive?: boolean;
}

export function CategoryTable({
  categories,
  isLoading = false,
  error = null,
  filterActive = false,
}: CategoryTableProps) {
  const columns = ["Category Name", "Amount", "Frequency", "Priority", "Type"];

  if (isLoading) {
    // Show BaseUI Skeleton rows
    return (
      <Table
        columns={columns}
        data={Array(5)
          .fill(0)
          .map(() => Array(columns.length).fill(<Skeleton animation height="16px" width="100%" />))}
      />
    );
  }

  if (error) {
    return <div style={{ color: "red", padding: "1rem" }}>Error loading categories: {error}</div>;
  }

  if (categories.length === 0) {
    return (
      <div style={{ padding: "1rem", color: "#888" }}>
        {filterActive ? "No categories match your filter." : "No categories available."}
      </div>
    );
  }

  const data = categories.map((cat) => {
    const parsed = parseCategoryName(cat.name);
    return [
      <span>{String(parsed.name)}</span>,
      <span>{String(cat.budgeted)}</span>,
      <span>{String(parsed.frequency ?? cat.frequency ?? "")}</span>,
      <span>{String(parsed.priority ?? cat.priority ?? "")}</span>,
      <span>{String(parsed.type ?? cat.type ?? "")}</span>,
    ];
  });

  return <Table columns={columns} data={data} />;
}
