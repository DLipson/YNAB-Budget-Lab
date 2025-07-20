// src/components/CategoryControls.tsx

import React from "react";
import { Select } from "baseui/select";

const sortOptions = [
  { label: "Name", id: "name" },
  { label: "Amount", id: "amount" },
  { label: "Frequency", id: "frequency" },
  { label: "Priority", id: "priority" },
  { label: "Type", id: "type" },
];

const filterOptions = [
  { label: "All", id: "all" },
  { label: "Income", id: "income" },
  { label: "Expense", id: "expense" },
];

export const CategoryControls: React.FC = () => {
  const [sortValue, setSortValue] = React.useState<{ label: string; id: string }[]>([]);

  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <Select
        options={sortOptions}
        placeholder="Sort by"
        value={sortValue}
        onChange={({ value }) => setSortValue([...value] as { label: string; id: string }[])}
        clearable={false}
      />
      <Select options={filterOptions} placeholder="Filter by" value={[]} onChange={() => {}} clearable={false} />
    </div>
  );
};
