import type { Sale } from "domain/entities/Sale";
import { salesStore } from "infrastructure/storage/localDb";

const ALL_SALES_KEY = "sales";

export class SalesLocalDataSource {
  async saveSale(sale: Sale): Promise<void> {
    const all = await this.getAllSales();
    all.push(sale);
    await salesStore.setItem(ALL_SALES_KEY, all);
  }

  async updateSale(saleId: string, updates: Partial<Sale>): Promise<Sale | null> {
    const all = await this.getAllSales();
    const index = all.findIndex((sale) => sale.id === saleId);
    if (index < 0) {
      return null;
    }

    all[index] = {
      ...all[index],
      ...updates,
    };

    await salesStore.setItem(ALL_SALES_KEY, all);
    return all[index];
  }

  async updateSaleCustomerId(saleId: string, customerId: string): Promise<Sale | null> {
    return this.updateSale(saleId, { customerId });
  }

  async markSaleSynced(saleId: string): Promise<Sale | null> {
    return this.updateSale(saleId, { status: "synced" });
  }

  async getAllSales(): Promise<Sale[]> {
    return (await salesStore.getItem<Sale[]>(ALL_SALES_KEY)) ?? [];
  }

  async getPendingSales(): Promise<Sale[]> {
    const all = await this.getAllSales();
    return all.filter((s) => s.status === "pending_sync");
  }
}
