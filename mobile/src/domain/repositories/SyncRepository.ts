export interface SyncResult {
  syncedAt: string;
  customersCount: number;
  pendingCustomersUploadedCount?: number;
  productsCount: number;
  categoriesCount: number;
  billAccountsCount: number;
}

export interface SyncPendingSalesResult {
  customersUploadedCount: number;
  salesUploadedCount: number;
}

export type SyncStep = "customers" | "products" | "categories" | "bill_accounts";

export interface SyncRepository {
  syncInitialData(token: string, onStep?: (step: SyncStep) => void): Promise<SyncResult>;
  syncPendingCustomers(token: string): Promise<number>;
  syncPendingSales(token: string): Promise<SyncPendingSalesResult>;
  isInitialSyncCompleted(): Promise<boolean>;
  getLastSyncAt(): Promise<string | null>;
  resetSyncState(): Promise<void>;
}
