import { Block } from "baseui/block";
import { Heading, HeadingLevel } from "baseui/heading";
import { ErrorBoundary } from "./components/ErrorBoundary";

import { CategoryControls } from "./components/CategoryControls";
import { CategoryTable } from "./components/CategoryTable";
import { useCategoryFilter } from "./hooks/useCategoryFilter";
import { useState } from "react";

// Mock category data
import type { Category } from "./types/ynab";

const mockCategories: Category[] = [
  {
    id: "1",
    name: "Groceries",
    category_group_id: "cg1",
    budgeted: 300,
    activity: -250,
    balance: 50,
    frequency: "monthly",
    priority: "high",
    type: "variable",
  },
  {
    id: "2",
    name: "Rent",
    category_group_id: "cg2",
    budgeted: 1200,
    activity: -1200,
    balance: 0,
    frequency: "monthly",
    priority: "high",
    type: "fixed",
  },
  {
    id: "3",
    name: "Salary",
    category_group_id: "cg3",
    budgeted: 5000,
    activity: 5000,
    balance: 0,
    frequency: "monthly",
    priority: "high",
    type: "income",
  },
  {
    id: "4",
    name: "Internet",
    category_group_id: "cg4",
    budgeted: 60,
    activity: -60,
    balance: 0,
    frequency: "monthly",
    priority: "medium",
    type: "fixed",
  },
];

function App() {
  // Filter and sort state
  const [filterState] = useState({});
  const [sortState] = useState<{ key: string; direction: "asc" | "desc" }>({ key: "name", direction: "asc" });

  // Connect filter/sort to hook
  const filteredCategories = useCategoryFilter({
    categories: mockCategories,
    filterState,
    sortState,
  });

  return (
    <ErrorBoundary>
      <Block>
        <Block>
          <HeadingLevel>
            <Heading level={3} margin="scale600">
              YNAB Budget Lab
            </Heading>
          </HeadingLevel>
        </Block>
        <Block as="main">
          <div style={{ marginBottom: "2rem" }}>
            {/* Controls UI */}
            <CategoryControls />
          </div>
          {/* Table UI */}
          <CategoryTable categories={filteredCategories as any} />
        </Block>
      </Block>
    </ErrorBoundary>
  );
}

export default App;
