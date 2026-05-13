import type { ExpenseLocalDataSource } from "data/datasources/local/ExpenseLocalDataSource";
import type { ExpenseRemoteDataSource } from "data/datasources/remote/ExpenseRemoteDataSource";
import type { Expense } from "domain/entities/Expense";

export class SyncPendingExpensesUseCase {
  constructor(
    private readonly expenseLocalDataSource: ExpenseLocalDataSource,
    private readonly expenseRemoteDataSource: ExpenseRemoteDataSource,
  ) {}

  async execute(token: string): Promise<Expense[]> {
    if (!token) {
      throw new Error("Session token is required");
    }

    // Get all local expenses
    const allExpenses = await this.expenseLocalDataSource.getAll();

    // Filter only pending_sync expenses
    const pendingExpenses = allExpenses.filter((e) => e.status === "pending_sync");

    if (pendingExpenses.length === 0) {
      return [];
    }

    // Sync each expense to backend
    const syncedExpenses: Expense[] = [];
    for (const expense of pendingExpenses) {
      try {
        await this.expenseRemoteDataSource.createExpense(expense, token);
        await this.expenseLocalDataSource.updateStatus(expense.id, "synced");
        syncedExpenses.push({ ...expense, status: "synced" });
      } catch (error) {
        console.error(`Failed to sync expense ${expense.id}:`, error);
        // Continue with next expense, don't throw
      }
    }

    return syncedExpenses;
  }
}
