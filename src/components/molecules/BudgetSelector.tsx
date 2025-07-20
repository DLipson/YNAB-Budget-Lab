import React from "react";

export type Budget = {
  id: string;
  name: string;
  last_modified_on?: string;
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
  const selectedBudget = selectedBudgetId != null ? budgets.find((b) => b.id === selectedBudgetId) : null;

  return (
    <div>
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
      {selectedBudget && (
        <div style={{ marginTop: "1em", fontSize: "0.95em" }}>
          <div>
            <strong>Name:</strong> {selectedBudget.name}
          </div>
          <div>
            <strong>Last Modified:</strong>{" "}
            {selectedBudget.last_modified_on ? new Date(selectedBudget.last_modified_on).toLocaleString() : "Unknown"}
          </div>
        </div>
      )}
    </div>
  );
};
