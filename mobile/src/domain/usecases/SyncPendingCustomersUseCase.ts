import type { SyncRepository } from "domain/repositories/SyncRepository";

export class SyncPendingCustomersUseCase {
  constructor(private readonly syncRepository: SyncRepository) {}

  async execute(token: string) {
    if (!token) {
      throw new Error("Session token is required");
    }

    return this.syncRepository.syncPendingCustomers(token);
  }
}
