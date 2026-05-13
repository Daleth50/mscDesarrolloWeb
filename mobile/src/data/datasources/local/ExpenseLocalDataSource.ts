import type { Expense } from "domain/entities/Expense";
import { expensesStore } from "infrastructure/storage/localDb";

const ALL_EXPENSES_KEY = "expenses";

export class ExpenseLocalDataSource {
  async saveExpense(expense: Expense): Promise<void> {
    const all = await this.getAll();
    all.push(expense);
    await expensesStore.setItem(ALL_EXPENSES_KEY, all);
  }

  async getAll(): Promise<Expense[]> {
    const expenses = (await expensesStore.getItem<Expense[]>(ALL_EXPENSES_KEY)) ?? [];
    // Sort by createdAt descending (newest first)
    return expenses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getPending(): Promise<Expense[]> {
    const all = await this.getAll();
    return all.filter((e) => e.status === "pending_sync");
  }

  async updateStatus(id: string, status: "synced" | "pending_sync"): Promise<Expense | null> {
    const all = await this.getAll();
    const index = all.findIndex((e) => e.id === id);
    if (index < 0) {
      return null;
    }

    all[index] = {
      ...all[index],
      status,
    };

    await expensesStore.setItem(ALL_EXPENSES_KEY, all);
    return all[index];
  }
}
