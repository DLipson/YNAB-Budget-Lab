import * as React from "react";
import { Table } from "baseui/table";
import { Skeleton } from "baseui/skeleton";
import { Block } from "baseui/block";
import { parseCategoryGroupName } from "../utils/categoryParser";

import type { Category } from "../types/ynab";

interface CategoryTableProps {
  categories: Category[];
  isLoading?: boolean;
  error?: string | null;
  filterActive?: boolean;
  onRetry?: () => void;
}

export function CategoryTable({
  categories,
  isLoading = false,
  error = null,
  filterActive = false,
  onRetry,
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
    return (
      <div style={{ color: "red", padding: "1rem" }}>
        Error loading categories: {error}
        <br />
        <button
          style={{
            marginTop: "0.5rem",
            padding: "0.5rem 1rem",
            background: "#e53e3e",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={() => typeof onRetry === "function" && onRetry()}
        >
          Retry
        </button>
      </div>
    );
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
    const parsedGroup = parseCategoryGroupName(cat.category_group_name ?? "");
    return [
      <span>{String(cat.name)}</span>,
      <span>{String(cat.budgeted)}</span>,
      <span>{String(parsedGroup.frequency ?? cat.frequency ?? "")}</span>,
      <span>{String(parsedGroup.priority ?? cat.priority ?? "")}</span>,
      <span>{String(parsedGroup.type ?? cat.type ?? "")}</span>,
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
    </Block>
  );
}
