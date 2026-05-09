import { SalesLocalDataSource } from "data/datasources/local/SalesLocalDataSource";
import type { CartItem } from "domain/entities/Cart";
import type { Sale } from "domain/entities/Sale";

interface CompleteSaleInput {
  customerId: string;
  items: CartItem[];
  billAccountId: string;
  total: number;
}

export class CompleteSaleUseCase {
  constructor(private readonly salesLocalDataSource: SalesLocalDataSource) {}

  async execute(input: CompleteSaleInput): Promise<Sale> {
    if (input.items.length === 0) throw new Error("Cart is empty");
    if (!input.billAccountId) throw new Error("Payment account is required");

    const sale: Sale = {
      id: crypto.randomUUID(),
      customerId: input.customerId,
      items: input.items,
      billAccountId: input.billAccountId,
      total: input.total,
      status: "pending_sync",
      createdAt: new Date().toISOString(),
    };

    await this.salesLocalDataSource.saveSale(sale);
    return sale;
  }
}
