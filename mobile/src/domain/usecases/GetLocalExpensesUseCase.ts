import type { ExpenseLocalDataSource } from "data/datasources/local/ExpenseLocalDataSource";
import type { Expense } from "domain/entities/Expense";

export class GetLocalExpensesUseCase {
  constructor(private readonly expenseLocalDataSource: ExpenseLocalDataSource) {}

  execute(): Promise<Expense[]> {
    return this.expenseLocalDataSource.getAll();
  }
}
