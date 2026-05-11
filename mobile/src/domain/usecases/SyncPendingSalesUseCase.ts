import type { SyncPendingSalesResult, SyncRepository } from "domain/repositories/SyncRepository";

export class SyncPendingSalesUseCase {
  constructor(private readonly syncRepository: SyncRepository) {}

  async execute(token: string): Promise<SyncPendingSalesResult> {
    if (!token) {
      throw new Error("Session token is required");
    }

    return this.syncRepository.syncPendingSales(token);
  }
}
