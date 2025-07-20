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

const frequencyOptions = [
  { label: "All", id: "all" },
  { label: "Daily", id: "daily" },
  { label: "Weekly", id: "weekly" },
  { label: "Monthly", id: "monthly" },
  { label: "Yearly", id: "yearly" },
];

const priorityOptions = [
  { label: "All", id: "all" },
  { label: "High", id: "high" },
  { label: "Medium", id: "medium" },
  { label: "Low", id: "low" },
];

const typeOptions = [
  { label: "All", id: "all" },
  { label: "Fixed", id: "fixed" },
  { label: "Variable", id: "variable" },
];

export const CategoryControls: React.FC = () => {
  const [sortValue, setSortValue] = React.useState<{ label: string; id: string }[]>([]);
  const [frequencyValue, setFrequencyValue] = React.useState<{ label: string; id: string }[]>([]);
  const [priorityValue, setPriorityValue] = React.useState<{ label: string; id: string }[]>([]);
  const [typeValue, setTypeValue] = React.useState<{ label: string; id: string }[]>([]);

  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <Select
        options={sortOptions}
        placeholder="Sort by"
        value={sortValue}
        onChange={({ value }) => setSortValue([...value] as { label: string; id: string }[])}
        clearable={false}
      />
      <Select
        options={frequencyOptions}
        placeholder="Frequency"
        value={frequencyValue}
        onChange={({ value }) => setFrequencyValue([...value] as { label: string; id: string }[])}
        clearable={false}
      />
      <Select
        options={priorityOptions}
        placeholder="Priority"
        value={priorityValue}
        onChange={({ value }) => setPriorityValue([...value] as { label: string; id: string }[])}
        clearable={false}
      />
      <Select
        options={typeOptions}
        placeholder="Type"
        value={typeValue}
        onChange={({ value }) => setTypeValue([...value] as { label: string; id: string }[])}
        clearable={false}
      />
      <Select options={filterOptions} placeholder="Filter by" value={[]} onChange={() => {}} clearable={false} />
    </div>
  );
};
