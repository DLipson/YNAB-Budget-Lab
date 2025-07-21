import * as React from "react";
import { Block } from "baseui/block";
import { Heading, HeadingLevel } from "baseui/heading";
import { ErrorBoundary } from "./components/molecules/ErrorBoundary";
import ApiKeyInput from "./components/molecules/ApiKeyInput";

import { CategoryControls } from "./components/molecules/CategoryControls";
import { CategoryTable } from "./components/organisms/CategoryTable";
import { useCategoryFilter } from "./hooks/useCategoryFilter";
import { useState } from "react";
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

  const { token, setToken, isAuthenticated, error: authError } = useAuth();

  // Always call hooks before any conditional return
  React.useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("[App] Loading:", loading, "Categories:", categories, "Error:", catError);
    }
  }, [loading, categories, catError]);

  React.useEffect(() => {
    async function loadCategories() {
      setLoading(true);
      setCatError(null);
      try {
        // Fetch budgets
        const budgets = await fetchBudgets(token);
        if (!budgets || budgets.length === 0) throw new Error("No budgets found.");
        const budgetId = budgets[0].id;
        setBudgetId(budgetId);
      } catch (err) {
        setCatError((err as Error).message);
        setLoading(false);
        if (process.env.NODE_ENV === "development") {
          console.error("[App] Budget fetch error:", err);
        }
      }
    }
    if (token) {
      loadCategories();
    }
  }, [token]);

  // Fetch categories when budgetId changes
  React.useEffect(() => {
    if (!budgetId || !token) return;
    let isMounted = true;
    setLoading(true);
    setCatError(null);

    async function fetchCats() {
      if (process.env.NODE_ENV === "development") {
        console.log("[App] Fetching categories for budgetId:", budgetId);
      }
      try {
        const cats = await fetchCategories(token as string, budgetId as string);
        if (isMounted) {
          setCategories(cats);
          setLoading(false);
          if (process.env.NODE_ENV === "development") {
            console.log("[App] Categories loaded:", cats.length);
          }
        }
      } catch (err) {
        if (isMounted) {
          setCatError((err as Error).message);
          setLoading(false);
          if (process.env.NODE_ENV === "development") {
            console.error("[App] Category fetch error:", err);
          }
        }
      }
    }

    fetchCats();
    return () => {
      isMounted = false;
    };
  }, [budgetId, token]);

  const filteredCategories = useCategoryFilter({
    categories,
    filterState,
    sortState,
  });

  if (!isAuthenticated) {
    return (
      <Block margin="scale600" display="flex" flexDirection="column" alignItems="center">
        <HeadingLevel>
          <Heading styleLevel={3}>Authenticate to Continue</Heading>
        </HeadingLevel>
        <div style={{ maxWidth: 400, width: "100%" }}>
          <ErrorBoundary>
            <React.Suspense fallback={null}>
              <ApiKeyInput onSubmit={setToken} />
            </React.Suspense>
          </ErrorBoundary>
          {authError && (
            <Block color="negative" marginTop="scale300">
              {authError}
            </Block>
          )}
        </div>
      </Block>
    );
  }

  // Show API key input if not authenticated
  // (handled above)

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
            <select value={selectedCategoryId || ""} onChange={(e) => setSelectedCategoryId(e.target.value || null)}>
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
              <TransactionView token={token} budgetId={budgetId} categoryId={selectedCategoryId} />
            </React.Suspense>
          </Block>
        )}
      </Block>
    </ErrorBoundary>
  );
}
export default App;
