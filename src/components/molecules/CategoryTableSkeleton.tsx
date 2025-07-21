import { Table } from "baseui/table";
import { Skeleton } from "baseui/skeleton";

interface CategoryTableSkeletonProps {
  columns: string[];
  rowCount?: number;
}

export function CategoryTableSkeleton({ columns, rowCount = 5 }: CategoryTableSkeletonProps) {
  return (
    <Table
      columns={columns}
      data={Array(rowCount)
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
