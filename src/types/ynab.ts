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
  category_group_name: string;
  budgeted: number;
  activity: number;
  balance: number;
  // Add more fields as needed
  [key: string]: unknown;
}

// YNAB API: Category Groups response
export interface CategoryGroup {
  id: string;
  name: string;
  hidden: boolean;
  deleted: boolean;
  categories: Category[];
  [key: string]: unknown;
}

export interface CategoryGroupsResponse {
  category_groups: CategoryGroup[];
}

// YNAB API: Transaction response
export interface Transaction {
  id: string;
  date: string;
  amount: number;
  memo?: string;
  cleared: "cleared" | "uncleared" | "reconciled";
  approved: boolean;
  account_id: string;
  payee_id?: string;
  category_id?: string;
  transfer_account_id?: string;
  import_id?: string;
  deleted: boolean;
  // Add more fields as needed
}

export interface TransactionsResponse {
  transactions: Transaction[];
  server_knowledge: number;
}
