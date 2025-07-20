// src/hooks/useBudgets.ts
import { useState, useEffect } from "react";
import { ynabFetch } from "../services/ynab-api";
import type { YnabApiResponse, BudgetSummary } from "../types/ynab";

export function useBudgets(apiKey: string) {
  const [budgets, setBudgets] = useState<BudgetSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiKey) return;
    setLoading(true);
    setError(null);
    ynabFetch<YnabApiResponse<{ budgets: BudgetSummary[] }>>("/budgets", {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
      .then((res) => setBudgets(res.data.budgets))
      .catch((err) => setError(err.message || "Failed to fetch budgets"))
      .finally(() => setLoading(false));
  }, [apiKey]);

  return { budgets, loading, error };
}
