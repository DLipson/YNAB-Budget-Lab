// src/config/api.ts

import { YNAB_API_KEY } from "./index";

export const YNAB_API_BASE_URL = "https://api.ynab.com/v1";

export function getYnabApiHeaders(): Record<string, string> {
  return {
    Authorization: `Bearer ${YNAB_API_KEY}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}
