import React from "react";

export type Budget = {
  id: string;
  name: string;
};

type BudgetSelectorProps = {
  budgets: Budget[];
  selectedBudgetId: string | null;
  onSelect: (budgetId: string) => void;
};

export const BudgetSelector: React.FC<BudgetSelectorProps> = ({ budgets, selectedBudgetId, onSelect }) => {
  return (
    <select value={selectedBudgetId ?? ""} onChange={(e) => onSelect(e.target.value)} aria-label="Select budget">
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
