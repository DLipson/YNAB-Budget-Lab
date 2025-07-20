// src/components/CategoryControls.tsx

import React from "react";
import { Select } from "baseui/select";

const sortOptions = [
  { label: "Name", id: "name" },
  { label: "Amount", id: "amount" },
  { label: "Date", id: "date" },
];

const filterOptions = [
  { label: "All", id: "all" },
  { label: "Income", id: "income" },
  { label: "Expense", id: "expense" },
];

export const CategoryControls: React.FC = () => {
  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <Select options={sortOptions} placeholder="Sort by" value={[]} onChange={() => {}} clearable={false} />
      <Select options={filterOptions} placeholder="Filter by" value={[]} onChange={() => {}} clearable={false} />
    </div>
  );
};
