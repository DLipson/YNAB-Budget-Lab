// src/components/molecules/BudgetSelector.tsx
import { useState } from "react";
import { useBudgets } from "../../hooks/useBudgets";

export interface BudgetSelectorProps {
  apiKey: string;
  onSelect: (budgetId: string) => void;
}

export function BudgetSelector({ apiKey, onSelect }: BudgetSelectorProps) {
  const { budgets, loading, error } = useBudgets(apiKey);
  const [selectedId, setSelectedId] = useState("");

  if (loading) return <div>Loading budgets...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!budgets.length) return <div>No budgets found.</div>;

  return (
    <div>
      <label htmlFor="budget-select">Select Budget:</label>
      <select
        id="budget-select"
        value={selectedId}
        onChange={(e) => {
          setSelectedId(e.target.value);
          onSelect(e.target.value);
        }}
        style={{ marginLeft: 8, padding: 8, fontSize: 16 }}
      >
        <option value="">-- Choose --</option>
        {budgets.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>
      {selectedId && (
        <div style={{ marginTop: 8 }}>
          <strong>Budget Metadata:</strong>
          <div>Name: {budgets.find((b) => b.id === selectedId)?.name}</div>
          <div>Last Modified: {budgets.find((b) => b.id === selectedId)?.last_modified_on}</div>
        </div>
      )}
    </div>
  );
}
