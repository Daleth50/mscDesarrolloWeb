import { metadataStore } from "infrastructure/storage/localDb";

const INITIAL_SYNC_KEY = "initial_sync_completed";
const LAST_SYNC_AT_KEY = "last_sync_at";

export class SyncLocalDataSource {
  async markSyncCompleted(syncedAt: string): Promise<void> {
    await metadataStore.setItem(INITIAL_SYNC_KEY, true);
    await metadataStore.setItem(LAST_SYNC_AT_KEY, syncedAt);
  }

  async isInitialSyncCompleted(): Promise<boolean> {
    const status = await metadataStore.getItem<boolean>(INITIAL_SYNC_KEY);
    return Boolean(status);
  }

  async getLastSyncAt(): Promise<string | null> {
    const lastSyncAt = await metadataStore.getItem<string>(LAST_SYNC_AT_KEY);
    return lastSyncAt || null;
  }

  async resetState(): Promise<void> {
    await metadataStore.removeItem(INITIAL_SYNC_KEY);
    await metadataStore.removeItem(LAST_SYNC_AT_KEY);
  }
}
