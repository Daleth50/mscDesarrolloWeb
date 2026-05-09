import type { Sale } from "domain/entities/Sale";
import { salesStore } from "infrastructure/storage/localDb";

const ALL_SALES_KEY = "sales";

export class SalesLocalDataSource {
  async saveSale(sale: Sale): Promise<void> {
    const all = await this.getAllSales();
    all.push(sale);
    await salesStore.setItem(ALL_SALES_KEY, all);
  }

  async getAllSales(): Promise<Sale[]> {
    return (await salesStore.getItem<Sale[]>(ALL_SALES_KEY)) ?? [];
  }

  async getPendingSales(): Promise<Sale[]> {
    const all = await this.getAllSales();
    return all.filter((s) => s.status === "pending_sync");
  }
}
