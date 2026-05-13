import type { Expense } from "domain/entities/Expense";
import { ApiClient } from "infrastructure/http/ApiClient";

export class ExpenseRemoteDataSource {
  constructor(private readonly apiClient: ApiClient) {}

  async createExpense(expense: Expense, token: string): Promise<Expense> {
    return this.apiClient.post<Expense>(
      "/api/expenses",
      {
        amount: expense.amount,
        note: expense.note,
        latitude: expense.latitude,
        longitude: expense.longitude,
        status: "success",
      },
      token,
    );
  }

  async createExpensesBatch(expenses: Expense[], token: string): Promise<Expense[]> {
    return this.apiClient.post<Expense[]>(
      "/api/expenses/batch",
      {
        expenses: expenses.map((e) => ({
          amount: e.amount,
          note: e.note,
          latitude: e.latitude,
          longitude: e.longitude,
          status: "success",
        })),
      },
      token,
    );
  }
}
