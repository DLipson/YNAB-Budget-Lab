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

import React, { useState } from "react";

export function CategoryTable({
  categories,
  isLoading = false,
  error = null,
  filterActive = false,
  onRetry,
}: CategoryTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [scenarioEnabled, setScenarioEnabled] = useState<Record<string, boolean>>({});
  const [adjustedValues, setAdjustedValues] = useState<Record<string, number>>({});
  const [defaults, setDefaults] = useState<Record<string, number>>({});

  // Initialize defaults on mount
  React.useEffect(() => {
    const initialDefaults: Record<string, number> = {};
    categories.forEach((cat) => {
      initialDefaults[cat.id] = cat.budgeted;
    });
    setDefaults(initialDefaults);
    setAdjustedValues(initialDefaults);
    // Enable all by default
    const initialEnabled: Record<string, boolean> = {};
    categories.forEach((cat) => {
      initialEnabled[cat.id] = true;
    });
    setScenarioEnabled(initialEnabled);
  }, [categories]);

  const columns = ["Select", "Scenario", "Category Name", "Amount", "Frequency", "Priority", "Type", "Adjust"];

  if (isLoading) {
    return <CategoryTableSkeleton columns={columns.slice(1)} />;
  }

  if (error) {
    return <CategoryError error={error} onRetry={onRetry} />;
  }

  if (categories.length === 0) {
    return <CategoryEmptyState filterActive={filterActive} />;
  }

  if (process.env.NODE_ENV === "development") {
    console.log(
      "[CategoryTable] Received categories:",
      Array.isArray(categories) ? categories.length : categories,
      categories
    );
  }

  const handleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleToggleScenario = (id: string) => {
    setScenarioEnabled((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAdjustValue = (id: string, value: number) => {
    setAdjustedValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleReset = () => {
    setAdjustedValues(defaults);
    const enabled: Record<string, boolean> = {};
    Object.keys(defaults).forEach((id) => {
      enabled[id] = true;
    });
    setScenarioEnabled(enabled);
  };

  const data = categories.map((category) => {
    const parsedGroup = parseCategoryGroupName(category.category_group_name ?? "");
    const type = String(parsedGroup.type ?? category.type ?? "");
    const isVariable = type.toLowerCase() === "variable";
    return [
      <input
        type="checkbox"
        checked={selectedIds.includes(category.id)}
        onChange={() => handleSelect(category.id)}
        aria-label={`Select ${category.name}`}
      />,
      <input
        type="checkbox"
        checked={scenarioEnabled[category.id] ?? true}
        onChange={() => handleToggleScenario(category.id)}
        aria-label={`Toggle scenario for ${category.name}`}
      />,
      <span>{String(category.name)}</span>,
      <span>{scenarioEnabled[category.id] ? adjustedValues[category.id] : 0}</span>,
      <span>{String(parsedGroup.frequency ?? category.frequency ?? "")}</span>,
      <span>{String(parsedGroup.priority ?? category.priority ?? "")}</span>,
      <span>{String(type)}</span>,
      isVariable && scenarioEnabled[category.id] ? (
        <input
          type="number"
          value={adjustedValues[category.id]}
          min={0}
          style={{ width: "80px" }}
          onChange={(e) => handleAdjustValue(category.id, Number(e.target.value))}
          aria-label={`Adjust amount for ${category.name}`}
        />
      ) : (
        <span>-</span>
      ),
    ];
  });

  // Real-time total calculation
  const total = categories.reduce(
    (sum, cat) => (scenarioEnabled[cat.id] ? sum + (adjustedValues[cat.id] ?? cat.budgeted) : sum),
    0
  );

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
      <Block marginTop="scale600" display="flex" alignItems="center" justifyContent="space-between">
        <div>
          <button
            type="button"
            disabled={selectedIds.length === 0}
            onClick={() => {
              const selectedAmounts = categories
                .filter((cat) => selectedIds.includes(cat.id))
                .map((cat) => (scenarioEnabled[cat.id] ? adjustedValues[cat.id] ?? cat.budgeted : 0));
              if (selectedAmounts.length === 0) return;
              const formula = "=" + selectedAmounts.join(" + ");
              navigator.clipboard.writeText(formula);
            }}
            style={{
              padding: "0.5rem 1rem",
              background: "#276ef1",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: selectedIds.length === 0 ? "not-allowed" : "pointer",
              fontWeight: 500,
              marginRight: "1rem",
            }}
            aria-label="Copy selected amounts to spreadsheet"
          >
            Copy to Spreadsheet
          </button>
          <button
            type="button"
            onClick={handleReset}
            style={{
              padding: "0.5rem 1rem",
              background: "#e2e2e2",
              color: "#333",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: 500,
            }}
            aria-label="Reset scenario planning"
          >
            Reset
          </button>
        </div>
        <div style={{ fontWeight: 600, fontSize: "1.1rem" }}>Total: {total}</div>
      </Block>
    </Block>
  );
}
