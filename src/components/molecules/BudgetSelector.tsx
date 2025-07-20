import React from "react";

export type Budget = {
  id: string;
  name: string;
};

type BudgetSelectorProps = {
  budgets: Budget[];
  selectedBudgetId: string | null;
  onSelect: (budgetId: string) => void;
  loading?: boolean;
  error?: string | null;
};

export const BudgetSelector: React.FC<BudgetSelectorProps> = ({
  budgets,
  selectedBudgetId,
  onSelect,
  loading = false,
  error = null,
}) => {
  if (loading) {
    return <div aria-busy="true">Loading budgets...</div>;
  }
  if (error) {
    return (
      <div role="alert" style={{ color: "red" }}>
        Error: {error}
      </div>
    );
  }
  return (
    <select
      value={selectedBudgetId ?? ""}
      onChange={(e) => onSelect(e.target.value)}
      aria-label="Select budget"
      disabled={loading}
    >
      <option value="" disabled>
        Select a budget
      </option>
      {budgets.map((budget) => (
        <option key={budget.id} value={budget.id}>
          {budget.name}
        </option>
      ))}
    </select>
  );
};
