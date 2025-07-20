import { Table } from "baseui/table";
import { Block } from "baseui/block";
import { parseCategoryGroupName } from "../utils/categoryParser";
import { CategoryTableSkeleton } from "../components/molecules/CategoryTableSkeleton";
import { CategoryError } from "../components/molecules/CategoryError";
import { CategoryEmptyState } from "../components/molecules/CategoryEmptyState";

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
    return <CategoryTableSkeleton columns={columns} />;
  }

  if (error) {
    return <CategoryError error={error} onRetry={onRetry} />;
  }

  if (categories.length === 0) {
    return <CategoryEmptyState filterActive={filterActive} />;
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
