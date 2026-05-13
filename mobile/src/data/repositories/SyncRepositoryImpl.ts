import { BillAccountsLocalDataSource } from "data/datasources/local/BillAccountsLocalDataSource";
import { ContactsLocalDataSource } from "data/datasources/local/ContactsLocalDataSource";
import { ProductsLocalDataSource } from "data/datasources/local/ProductsLocalDataSource";
import { SyncLocalDataSource } from "data/datasources/local/SyncLocalDataSource";
import { BillAccountsRemoteDataSource } from "data/datasources/remote/BillAccountsRemoteDataSource";
import { ContactsRemoteDataSource } from "data/datasources/remote/ContactsRemoteDataSource";
import { PosOrdersRemoteDataSource } from "data/datasources/remote/PosOrdersRemoteDataSource";
import { ProductsRemoteDataSource } from "data/datasources/remote/ProductsRemoteDataSource";
import type {
  SyncPendingSalesResult,
  SyncRepository,
  SyncResult,
  SyncStep,
} from "domain/repositories/SyncRepository";
import type { Sale } from "domain/entities/Sale";

export class SyncRepositoryImpl implements SyncRepository {
  constructor(
    private readonly contactsRemoteDataSource: ContactsRemoteDataSource,
    private readonly contactsLocalDataSource: ContactsLocalDataSource,
    private readonly productsRemoteDataSource: ProductsRemoteDataSource,
    private readonly productsLocalDataSource: ProductsLocalDataSource,
    private readonly billAccountsRemoteDataSource: BillAccountsRemoteDataSource,
    private readonly billAccountsLocalDataSource: BillAccountsLocalDataSource,
    private readonly posOrdersRemoteDataSource: PosOrdersRemoteDataSource,
    private readonly salesLocalDataSource: { getPendingSales(): Promise<Sale[]>; updateSaleCustomerId(saleId: string, customerId: string): Promise<Sale | null>; markSaleSynced(saleId: string): Promise<Sale | null>; },
    private readonly syncLocalDataSource: SyncLocalDataSource,
  ) {}

  async syncInitialData(token: string, onStep?: (step: SyncStep) => void): Promise<SyncResult> {
    onStep?.("customers");
    const customers = await this.contactsRemoteDataSource.getCustomers(token);
    const localCustomers = await this.contactsLocalDataSource.getCustomers();
    const pendingCustomers = localCustomers.filter((contact) => contact.kind === "customer" && contact.pendingSync);
    const mergedCustomers = [...customers];

    for (const pendingCustomer of pendingCustomers) {
      if (!mergedCustomers.some((contact) => contact.id === pendingCustomer.id)) {
        mergedCustomers.push(pendingCustomer);
      }
    }

    await this.contactsLocalDataSource.saveCustomers(mergedCustomers);

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
      pendingCustomersUploadedCount: pendingCustomers.length,
      productsCount: products.length,
      categoriesCount: categories.length,
      billAccountsCount: billAccounts.length,
    };
  }

  async syncPendingCustomers(token: string): Promise<number> {
    const result = await this.uploadPendingCustomers(token);
    return result.length;
  }

  async syncPendingSales(token: string): Promise<SyncPendingSalesResult> {
    const syncedCustomers = await this.uploadPendingCustomers(token);
    const customerIdMap = new Map(syncedCustomers.map((item) => [item.localId, item.serverId]));

    const pendingSales = await this.salesLocalDataSource.getPendingSales();
    let uploadedSales = 0;

    for (const sale of pendingSales) {
      const resolvedCustomerId = customerIdMap.get(sale.customerId) ?? sale.customerId;
      if (resolvedCustomerId !== sale.customerId) {
        await this.salesLocalDataSource.updateSaleCustomerId(sale.id, resolvedCustomerId);
      }

      let remoteCartId: string | null = null;
      try {
        const billAccounts = await this.billAccountsLocalDataSource.getBillAccounts();
        const billAccount = billAccounts.find((account) => account.id === sale.billAccountId);
        if (!billAccount) {
          throw new Error("Bill account not found");
        }

        const remoteCart = await this.posOrdersRemoteDataSource.createCart(token, resolvedCustomerId);
        remoteCartId = remoteCart.id;

        for (const item of sale.items) {
          await this.posOrdersRemoteDataSource.addCartItem(token, remoteCart.id, item);
        }

        const paymentMethod = billAccount.type === "cash" ? "cash" : "transfer";
        await this.posOrdersRemoteDataSource.completeCart(token, remoteCart.id, {
          billAccountId: sale.billAccountId,
          paymentMethod,
        });

        await this.salesLocalDataSource.markSaleSynced(sale.id);
        uploadedSales += 1;
      } catch (error) {
        console.error(`[SyncPendingSales] Failed to sync sale ${sale.id}:`, error);
        if (remoteCartId) {
          try {
            await this.posOrdersRemoteDataSource.deleteCart(token, remoteCartId);
          } catch (deleteError) {
            console.error(`[SyncPendingSales] Failed to delete orphan cart ${remoteCartId}:`, deleteError);
          }
        }
      }
    }

    return {
      customersUploadedCount: syncedCustomers.length,
      salesUploadedCount: uploadedSales,
    };
  }

  private async uploadPendingCustomers(token: string): Promise<Array<{ localId: string; serverId: string }>> {
    const localCustomers = await this.contactsLocalDataSource.getCustomers();
    const pendingCustomers = localCustomers.filter(
      (contact) => contact.kind === "customer" && contact.pendingSync,
    );

    if (pendingCustomers.length === 0) {
      return [];
    }

    const remainingCustomers: typeof localCustomers = [];
    const mappings: Array<{ localId: string; serverId: string }> = [];

    for (const customer of localCustomers) {
      if (customer.kind !== "customer" || !customer.pendingSync) {
        remainingCustomers.push(customer);
        continue;
      }

      try {
        const createdCustomer = await this.contactsRemoteDataSource.createCustomer(token, {
          name: customer.name,
          email: customer.email ?? null,
          phone: customer.phone ?? null,
          address: customer.address ?? null,
          notes: customer.notes ?? null,
          geolocation: customer.geolocation ?? null,
          pendingSync: false,
          kind: "customer",
        } as unknown as Omit<import("domain/entities/Contact").Contact, "id">);

        remainingCustomers.push({
          ...createdCustomer,
          pendingSync: false,
        });
        mappings.push({ localId: customer.id, serverId: createdCustomer.id });
      } catch {
        remainingCustomers.push(customer);
      }
    }

    await this.contactsLocalDataSource.saveCustomers(remainingCustomers);
    return mappings;
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
