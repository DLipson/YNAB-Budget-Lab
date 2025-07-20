// src/types/ynab.ts

export interface YnabApiError {
  id: string;
  name: string;
  detail: string;
}

export interface YnabApiResponse<T = unknown> {
  data: T;
  error?: YnabApiError;
}
// Example: User response
export interface User {
  id: string;
  email: string;
  name: string;
  // Add more fields as needed
}

// Example: Budget summary response
export interface BudgetSummary {
  id: string;
  name: string;
  last_modified_on: string;
  first_month: string;
  last_month: string;
  // Add more fields as needed
}

// Example: Category response
export interface Category {
  id: string;
  name: string;
  category_group_id: string;
  budgeted: number;
  activity: number;
  balance: number;
  // Add more fields as needed
}
