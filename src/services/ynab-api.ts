// src/services/ynab-api.ts
import { YNAB_API_BASE_URL, getYnabApiHeaders } from "../config/api";
import type { YnabApiResponse } from "../types/ynab";

/**
 * Base fetch wrapper for YNAB API requests.
 * Only handles request construction and response parsing.
 * Implements simple rate limiting: max 200 requests per hour.
 */

let requestCount = 0;
let windowStart = Date.now();

const MAX_REQUESTS_PER_HOUR = 200;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

export async function ynabFetch<T = YnabApiResponse>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const now = Date.now();
  if (now - windowStart >= WINDOW_MS) {
    // Reset window
    windowStart = now;
    requestCount = 0;
  }
  if (requestCount >= MAX_REQUESTS_PER_HOUR) {
    throw new Error("YNAB API rate limit exceeded: max 200 requests per hour.");
  }
  requestCount++;

  const url = `${YNAB_API_BASE_URL}${endpoint}`;
  const headers = { ...getYnabApiHeaders(), ...options.headers };

  if (process.env.NODE_ENV === "development") {
    // Minimal request logging
    console.log("[YNAB API] Request:", {
      method: options.method || "GET",
      url,
      headers,
      body: options.body,
    });
  }

  let response: Response;
  try {
    response = await fetch(url, { ...options, headers });
  } catch (err) {
    throw new Error(
      `Network error while contacting YNAB API: ${err instanceof Error && err.message ? err.message : String(err)}`
    );
  }
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`YNAB API error: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ""}`);
  }

  if (process.env.NODE_ENV === "development") {
    // Minimal response logging
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
