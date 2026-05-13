export type ExpenseStatus = "pending_sync" | "synced";

export interface Expense {
  id: string;
  amount: number;
  note?: string;
  latitude?: number;
  longitude?: number;
  status: ExpenseStatus;
  createdAt: string;
}
