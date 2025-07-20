// src/hooks/useBudgets.ts
import { useState, useEffect } from "react";
import { ynabFetch } from "../services/ynab-api";
import type { BudgetSummary, YnabApiResponse } from "../types/ynab";

/**
 * Minimal hook for fetching and managing YNAB budget data.
 * SRP: Only handles budget list retrieval.
 */
export function useBudgets() {
  const [budgets, setBudgets] = useState<BudgetSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    ynabFetch<YnabApiResponse<{ budgets: BudgetSummary[] }>>("/budgets")
      .then((res) => {
        if (isMounted) {
          setBudgets(res.data.budgets || []);
          setError(res.error ? res.error.detail : null);
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || "Unknown error");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return { budgets, loading, error };
}
