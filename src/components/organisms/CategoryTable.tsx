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

  const data = categories.map((category) => {
    const parsedGroup = parseCategoryGroupName(category.category_group_name ?? "");
    return [
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
    </Block>
  );
}
