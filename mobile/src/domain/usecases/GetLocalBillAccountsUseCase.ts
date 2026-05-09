import type { BillAccountsLocalDataSource } from "data/datasources/local/BillAccountsLocalDataSource";

export class GetLocalBillAccountsUseCase {
  constructor(private readonly billAccountsLocalDataSource: BillAccountsLocalDataSource) {}

  execute() {
    return this.billAccountsLocalDataSource.getBillAccounts();
  }
}
