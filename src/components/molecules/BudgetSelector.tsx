import React from "react";
import { Block } from "baseui/block";
import { Select } from "baseui/select";

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
  const options = budgets.map((budget) => ({
    id: budget.id,
    label: budget.name,
    budget,
  }));

  const selectedOption = options.find((opt) => opt.id === selectedBudgetId) || null;

  if (loading) {
    return (
      <Block aria-busy="true" color="mono700">
        Loading budgets...
      </Block>
    );
  }
  if (error) {
    return (
      <Block role="alert" color="negative">
        Error: {error}
      </Block>
    );
  }

  return (
    <Block>
      <Select
        options={options}
        value={selectedOption ? [selectedOption] : []}
        placeholder="Select a budget"
        onChange={({ value }) => {
          if (value && value[0]) {
            if (typeof value[0].id === "string") {
              onSelect(value[0].id);
            }
          }
        }}
        isLoading={loading}
        clearable={false}
        disabled={loading}
        overrides={{
          Dropdown: { style: { zIndex: 1000 } },
        }}
        labelKey="label"
        valueKey="id"
        size="compact"
      />
      {selectedOption && (
        <Block marginTop="scale500" font="font300">
          <Block>
            <strong>Name:</strong> {selectedOption.label}
          </Block>
          <Block>
            <strong>Last Modified:</strong>{" "}
            {selectedOption.budget.last_modified_on
              ? new Date(selectedOption.budget.last_modified_on).toLocaleString()
              : "Unknown"}
          </Block>
        </Block>
      )}
    </Block>
  );
};
