import * as React from "react";
import { Table } from "baseui/table";
import { parseCategoryName } from "../utils/categoryParser";

type Category = {
  name: string;
  amount: number;
  frequency: string;
  priority: string;
  type: string;
};

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
    // Show skeleton rows
    return (
      <Table
        columns={columns}
        data={Array(5)
          .fill(0)
          .map(() =>
            Array(columns.length).fill(
              <div style={{ width: "100%" }}>
                {/* BaseUI Skeleton */}
                <div
                  className="baseui-skeleton"
                  style={{
                    height: "16px",
                    background: "#eee",
                    borderRadius: "4px",
                  }}
                />
              </div>
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
      <div style={{ padding: "1rem", color: "#888" }}>
        {filterActive ? "No categories match your filter." : "No categories available."}
      </div>
    );
  }

  const data = categories.map((cat) => {
    const parsed = parseCategoryName(cat.name);
    return [
      parsed.name,
      cat.amount,
      parsed.frequency ?? cat.frequency ?? "",
      parsed.priority ?? cat.priority ?? "",
      parsed.type ?? cat.type ?? "",
    ];
  });

  return <Table columns={columns} data={data} />;
}
