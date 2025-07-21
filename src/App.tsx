import * as React from "react";
import { Block } from "baseui/block";
import { Heading, HeadingLevel } from "baseui/heading";
import { ErrorBoundary } from "./components/molecules/ErrorBoundary";
import { Skeleton } from "baseui/skeleton";

import { CategoryControls } from "./components/molecules/CategoryControls";
import { CategoryTable } from "./components/organisms/CategoryTable";
import { useCategoryFilter } from "./hooks/useCategoryFilter";
import { useState } from "react";
import ApiKeyInput from "./components/molecules/ApiKeyInput";
import { useAuth } from "./hooks/useAuth";

import type { Category } from "./types/ynab";
import { TransactionView } from "./components/organisms/TransactionView";

/* mockCategories removed */

import { fetchBudgets, fetchCategories } from "./services/ynab-api";

function App() {
  const [filterState] = useState({});
  const [sortState] = useState<{ key: string; direction: "asc" | "desc" }>({ key: "name", direction: "asc" });

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [catError, setCatError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [budgetId, setBudgetId] = useState<string | null>(null);

  const { token, setToken, isAuthenticated, error } = useAuth();

  React.useEffect(() => {
    let isMounted = true;
    async function loadCategories() {
      setLoading(true);
      setCatError(null);
      try {
        // Fetch budgets
        const budgets = await fetchBudgets(token);
        if (!budgets || budgets.length === 0) throw new Error("No budgets found.");
        const budgetId = budgets[0].id;
        // Fetch categories for first budget
        setBudgetId(budgetId);
        const cats = await fetchCategories(token, budgetId);
        if (process.env.NODE_ENV === "development") {
          console.log("[App] Categories fetched:", Array.isArray(cats) ? cats.length : cats, cats);
        }
        if (isMounted) setCategories(cats);
      } catch (err: unknown) {
        if (process.env.NODE_ENV === "development") {
          console.error("[App] Error loading categories:", err);
        }
        if (isMounted) {
          const errorMsg =
            typeof err === "object" && err !== null && "message" in err
              ? (err as { message?: string }).message || "Failed to load categories."
              : "Failed to load categories.";
          setCatError(errorMsg);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    if (isAuthenticated && token) {
      loadCategories();
    }
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, token]);

  const filteredCategories = useCategoryFilter({
    categories,
    filterState,
    sortState,
  });

  // Show API key input if not authenticated
  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        <Block>
          <HeadingLevel>
            <Heading styleLevel={3}>YNAB Budget Lab</Heading>
          </HeadingLevel>
        </Block>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Block>
        <HeadingLevel>
          <Heading styleLevel={3}>YNAB Budget Lab</Heading>
        </HeadingLevel>
        <CategoryControls />
        <Block marginBottom="scale400">
          <label>
            Select Category:{" "}
            <select
              value={selectedCategoryId || ""}
              onChange={(e) => setSelectedCategoryId(e.target.value || null)}
            >
              <option value="">-- Select --</option>
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>
        </Block>
        <CategoryTable
          categories={filteredCategories}
          isLoading={loading}
          error={catError}
          filterActive={!!Object.keys(filterState).length}
          onRetry={() => window.location.reload()}
        />
        {selectedCategoryId && budgetId && token && (
          <Block marginTop="scale800">
            <React.Suspense fallback={<div>Loading transactions...</div>}>
              <TransactionView
                token={token}
                budgetId={budgetId}
                categoryId={selectedCategoryId}
              />
            </React.Suspense>
          </Block>
        )}
      </Block>
    </ErrorBoundary>
  );
export default App;

  // Main app UI after authentication
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
          {loading ? (

export default App;
