import { BillAccountsLocalDataSource } from "data/datasources/local/BillAccountsLocalDataSource";
import { ContactsLocalDataSource } from "data/datasources/local/ContactsLocalDataSource";
import { ProductsLocalDataSource } from "data/datasources/local/ProductsLocalDataSource";
import { SyncLocalDataSource } from "data/datasources/local/SyncLocalDataSource";
import { BillAccountsRemoteDataSource } from "data/datasources/remote/BillAccountsRemoteDataSource";
import { ContactsRemoteDataSource } from "data/datasources/remote/ContactsRemoteDataSource";
import { ProductsRemoteDataSource } from "data/datasources/remote/ProductsRemoteDataSource";
import type { SyncRepository, SyncResult, SyncStep } from "domain/repositories/SyncRepository";

export class SyncRepositoryImpl implements SyncRepository {
  constructor(
    private readonly contactsRemoteDataSource: ContactsRemoteDataSource,
    private readonly contactsLocalDataSource: ContactsLocalDataSource,
    private readonly productsRemoteDataSource: ProductsRemoteDataSource,
    private readonly productsLocalDataSource: ProductsLocalDataSource,
    private readonly billAccountsRemoteDataSource: BillAccountsRemoteDataSource,
    private readonly billAccountsLocalDataSource: BillAccountsLocalDataSource,
    private readonly syncLocalDataSource: SyncLocalDataSource,
  ) {}

  async syncInitialData(token: string, onStep?: (step: SyncStep) => void): Promise<SyncResult> {
    onStep?.("customers");
    const customers = await this.contactsRemoteDataSource.getCustomers(token);
    await this.contactsLocalDataSource.saveCustomers(customers);

    onStep?.("categories");
    const categories = await this.productsRemoteDataSource.getCategories(token);
    await this.productsLocalDataSource.saveCategories(categories);

    onStep?.("products");
    const products = await this.productsRemoteDataSource.getPosProducts(token);
    await this.productsLocalDataSource.saveProducts(products);

    onStep?.("bill_accounts");
    const billAccounts = await this.billAccountsRemoteDataSource.getBillAccounts(token);
    await this.billAccountsLocalDataSource.saveBillAccounts(billAccounts);

    const syncedAt = new Date().toISOString();
    await this.syncLocalDataSource.markSyncCompleted(syncedAt);

    return {
      syncedAt,
      customersCount: customers.length,
      productsCount: products.length,
      categoriesCount: categories.length,
      billAccountsCount: billAccounts.length,
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
    await this.productsLocalDataSource.clear();
    await this.billAccountsLocalDataSource.clear();
    await this.syncLocalDataSource.resetState();
  }
}
