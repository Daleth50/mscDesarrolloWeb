import type { BillAccount } from "domain/entities/BillAccount";
import { ApiClient } from "infrastructure/http/ApiClient";

export class BillAccountsRemoteDataSource {
  constructor(private readonly apiClient: ApiClient) {}

  async getBillAccounts(token: string): Promise<BillAccount[]> {
    return this.apiClient.get<BillAccount[]>("/api/pos/bill-accounts", token);
  }
}
