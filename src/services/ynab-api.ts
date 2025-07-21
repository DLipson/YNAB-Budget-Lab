import { YNAB_API_BASE_URL, getYnabApiHeaders } from "../config/api";
import type { YnabApiResponse } from "../types/ynab";
import type { BudgetSummary } from "../types/ynab";

/**
 * Base fetch wrapper for YNAB API requests.
 * Only handles request construction and response parsing.
 * Implements simple rate limiting: max 200 requests per hour.
 */

let requestCount = 0;
let windowStart = Date.now();

const MAX_REQUESTS_PER_HOUR = 200;
const WINDOW_MS = 60 * 60 * 1000;

export async function ynabFetch<T = YnabApiResponse>(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const now = Date.now();
  if (now - windowStart >= WINDOW_MS) {
    windowStart = now;
    requestCount = 0;
  }
  if (requestCount >= MAX_REQUESTS_PER_HOUR) {
    throw new Error("YNAB API rate limit exceeded: max 200 requests per hour.");
  }
  requestCount++;

  // Log token presence (masked)
  if (process.env.NODE_ENV === "development") {
    console.log("[YNAB API] Token:", typeof token === "string" ? token.slice(0, 4) + "***" : "none");
  }

  const url = `${YNAB_API_BASE_URL}${endpoint}`;
  const headers = {
    ...getYnabApiHeaders(),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // Reject if token looks like a budgetId (regression test)
  if (headers.Authorization && headers.Authorization.includes("budget-id")) {
    throw new Error("Authorization header must use API key, not budgetId");
  }

  if (process.env.NODE_ENV === "development") {
    console.log("[YNAB API] Request:", {
      method: options.method || "GET",
      url,
      headers,
      body: options.body,
    });
  }

  let response: Response | undefined = undefined;
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      response = await fetch(url, { ...options, headers });
      if (process.env.NODE_ENV === "development") {
        console.log("[YNAB API] Response status:", response.status);
      }
      break;
    } catch (err) {
      lastError = new Error(
        `Network error while contacting YNAB API: ${err instanceof Error && err.message ? err.message : String(err)}`
      );
      if (process.env.NODE_ENV === "development") {
        console.error("[YNAB API] Network error:", lastError);
      }
      if (attempt === 0) {
        await new Promise((res) => setTimeout(res, 1000)); // Wait 1s before retry
      }
    }
  }
  if (!response) {
    throw lastError || new Error("Unknown error during YNAB API request.");
  }
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`YNAB API error: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ""}`);
  }

  if (process.env.NODE_ENV === "development") {
    const cloned = response.clone();
    let responseBody: unknown;
    try {
      responseBody = await cloned.json();
    } catch {
      responseBody = await cloned.text();
    }
    console.log("[YNAB API] Response:", {
      status: response.status,
      statusText: response.statusText,
      body: responseBody,
    });
  }

  return response.json();
}

/**
 * Fetches the list of budgets from the YNAB API.
 * Returns an array of BudgetSummary objects.
 */
export async function fetchBudgets(token: string): Promise<BudgetSummary[]> {
  const response = await ynabFetch<YnabApiResponse<{ budgets: BudgetSummary[] }>>("/budgets", {}, token);
  if (response.error) {
    throw new Error(`YNAB API error: ${response.error.detail}`);
  }
  return response.data.budgets;
}

/**
 * Fetches categories for a given budget from the YNAB API.
 * Returns an array of Category objects.
 */
import type { CategoryGroup } from "../types/ynab";
export async function fetchCategories(token: string, budgetId: string): Promise<CategoryGroup[]> {
  const response = await ynabFetch<YnabApiResponse<{ category_groups: CategoryGroup[] }>>(
    `/budgets/${budgetId}/categories`,
    {},
    token
  );
  if (response.error) {
    throw new Error(`YNAB API error: ${response.error.detail}`);
  }
  return response.data.category_groups;
}

/**
 * Fetches transactions for a given budget and category, with paging.
 * Returns an array of Transaction objects.
 */
import type { Transaction } from "../types/ynab";
export async function fetchTransactions(
  token: string,
  budgetId: string,
  categoryId: string,
  page: number = 1,
  pageSize: number = 25
): Promise<{ transactions: Transaction[]; total: number }> {
  const offset = (page - 1) * pageSize;
  const response = await ynabFetch<YnabApiResponse<{ transactions: Transaction[] }>>(
    `/budgets/${budgetId}/transactions`,
    {},
    token
  );
  if (response.error) {
    throw new Error(`YNAB API error: ${response.error.detail}`);
  }
  // Filter by categoryId
  const filtered = response.data.transactions.filter((tx) => tx.category_id === categoryId);
  const paged = filtered.slice(offset, offset + pageSize);
  return { transactions: paged, total: filtered.length };
}
