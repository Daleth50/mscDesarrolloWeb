import { ContactsLocalDataSource } from "data/datasources/local/ContactsLocalDataSource";
import { SyncLocalDataSource } from "data/datasources/local/SyncLocalDataSource";
import { ContactsRemoteDataSource } from "data/datasources/remote/ContactsRemoteDataSource";
import type { SyncRepository, SyncResult } from "domain/repositories/SyncRepository";

export class SyncRepositoryImpl implements SyncRepository {
  constructor(
    private readonly contactsRemoteDataSource: ContactsRemoteDataSource,
    private readonly contactsLocalDataSource: ContactsLocalDataSource,
    private readonly syncLocalDataSource: SyncLocalDataSource,
  ) {}

  async syncInitialData(token: string): Promise<SyncResult> {
    const customers = await this.contactsRemoteDataSource.getCustomers(token);
    await this.contactsLocalDataSource.saveCustomers(customers);

    const syncedAt = new Date().toISOString();
    await this.syncLocalDataSource.markSyncCompleted(syncedAt);

    return {
      syncedAt,
      customersCount: customers.length,
    };
  }

  async isInitialSyncCompleted(): Promise<boolean> {
    return this.syncLocalDataSource.isInitialSyncCompleted();
  }

  async getLastSyncAt(): Promise<string | null> {
    return this.syncLocalDataSource.getLastSyncAt();
  }

  async resetSyncState(): Promise<void> {
    await this.contactsLocalDataSource.clearCustomers();
    await this.syncLocalDataSource.resetState();
  }
}
