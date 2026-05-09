import type { CartItem } from "./Cart";

export type SaleStatus = "pending_sync" | "synced";

export interface Sale {
  id: string;
  customerId: string;
  items: CartItem[];
  billAccountId: string;
  total: number;
  status: SaleStatus;
  createdAt: string;
}
