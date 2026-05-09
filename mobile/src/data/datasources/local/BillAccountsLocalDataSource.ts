import type { BillAccount } from "domain/entities/BillAccount";
import { billAccountsStore } from "infrastructure/storage/localDb";

const BILL_ACCOUNTS_KEY = "bill_accounts";

export class BillAccountsLocalDataSource {
  async saveBillAccounts(accounts: BillAccount[]): Promise<void> {
    await billAccountsStore.setItem(BILL_ACCOUNTS_KEY, accounts);
  }

  async getBillAccounts(): Promise<BillAccount[]> {
    return (await billAccountsStore.getItem<BillAccount[]>(BILL_ACCOUNTS_KEY)) ?? [];
  }

  async clear(): Promise<void> {
    await billAccountsStore.removeItem(BILL_ACCOUNTS_KEY);
  }
}
