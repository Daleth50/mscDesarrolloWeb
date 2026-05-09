export interface SyncResult {
  syncedAt: string;
  customersCount: number;
  productsCount: number;
  categoriesCount: number;
  billAccountsCount: number;
}

export type SyncStep = "customers" | "products" | "categories" | "bill_accounts";

export interface SyncRepository {
  syncInitialData(token: string, onStep?: (step: SyncStep) => void): Promise<SyncResult>;
  isInitialSyncCompleted(): Promise<boolean>;
  getLastSyncAt(): Promise<string | null>;
  resetSyncState(): Promise<void>;
}
