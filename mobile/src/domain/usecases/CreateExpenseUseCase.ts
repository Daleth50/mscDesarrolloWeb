import { ExpenseLocalDataSource } from "data/datasources/local/ExpenseLocalDataSource";
import type { Expense } from "domain/entities/Expense";

interface CreateExpenseInput {
  amount: number;
  note?: string;
  latitude?: number;
  longitude?: number;
}

export class CreateExpenseUseCase {
  constructor(private readonly expenseLocalDataSource: ExpenseLocalDataSource) {}

  async execute(input: CreateExpenseInput): Promise<Expense> {
    if (input.amount <= 0) throw new Error("Amount must be greater than zero");

    const expense: Expense = {
      id: crypto.randomUUID(),
      amount: input.amount,
      note: input.note,
      latitude: input.latitude,
      longitude: input.longitude,
      status: "pending_sync",
      createdAt: new Date().toISOString(),
    };

    await this.expenseLocalDataSource.saveExpense(expense);
    return expense;
  }
}
