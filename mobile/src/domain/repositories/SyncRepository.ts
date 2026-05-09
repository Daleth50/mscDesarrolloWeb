export interface SyncResult {
  syncedAt: string;
  customersCount: number;
}

export interface SyncRepository {
  syncInitialData(token: string): Promise<SyncResult>;
  isInitialSyncCompleted(): Promise<boolean>;
  getLastSyncAt(): Promise<string | null>;
  resetSyncState(): Promise<void>;
}
