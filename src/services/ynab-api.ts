// src/services/ynab-api.ts
import { YNAB_API_BASE_URL, getYnabApiHeaders } from "../config/api";
import type { YnabApiResponse } from "../types/ynab";

// Simple in-memory rate limiter
let requestCount = 0;
let resetTime = Date.now() + 60 * 60 * 1000; // 1 hour

function checkRateLimit() {
  if (Date.now() > resetTime) {
    requestCount = 0;
    resetTime = Date.now() + 60 * 60 * 1000;
  }
  if (requestCount >= 200) {
    throw new Error("YNAB API rate limit exceeded (200 requests/hour)");
  }
  requestCount++;
}

export async function ynabFetch<T = YnabApiResponse>(endpoint: string, options: RequestInit = {}): Promise<T> {
  checkRateLimit();
  const url = `${YNAB_API_BASE_URL}${endpoint}`;
  const headers = { ...getYnabApiHeaders(), ...options.headers };

  try {
    // Logging request
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log("[YNAB API] Request:", url, options);
    }
    const response = await fetch(url, { ...options, headers });
    const data = await response.json();

    // Logging response
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log("[YNAB API] Response:", data);
    }

    if (!response.ok) {
      throw new Error(data?.error?.detail || `YNAB API error: ${response.status} ${response.statusText}`);
    }
    return data as T;
  } catch (error: any) {
    // Logging error
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error("[YNAB API] Error:", error);
    }
    throw new Error(error?.message || "Network error occurred while calling YNAB API");
  }
}
