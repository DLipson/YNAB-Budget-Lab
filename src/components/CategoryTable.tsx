import * as React from "react";
import { Table } from "baseui/table";
import { Skeleton } from "baseui/skeleton";
import { Block } from "baseui/block";
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
          .map(() =>
            Array(columns.length).fill(
              <Skeleton
                animation
                height="16px"
                width="100%"
                overrides={{
                  Root: {
                    props: { className: "baseui-skeleton" },
                  },
                }}
              />
            )
          )}
      />
    );
  }

  if (error) {
    return <div style={{ color: "red", padding: "1rem" }}>Error loading categories: {error}</div>;
  }

  if (categories.length === 0) {
    return (
      <Block
        overrides={{
          Block: {
            style: {
              padding: "1.5rem",
              color: "#888",
              textAlign: "center",
              backgroundColor: "#f7f7f7",
              borderRadius: "8px",
              margin: "1rem 0",
            },
          },
        }}
      >
        {filterActive ? "No categories match your filter." : "No categories available."}
      </Block>
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
