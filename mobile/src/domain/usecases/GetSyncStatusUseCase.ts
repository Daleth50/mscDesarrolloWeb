import type { SyncRepository } from "domain/repositories/SyncRepository";

export interface SyncStatus {
  isInitialSyncCompleted: boolean;
  lastSyncAt: string | null;
}

export class GetSyncStatusUseCase {
  constructor(private readonly syncRepository: SyncRepository) {}

  async execute(): Promise<SyncStatus> {
    const [isInitialSyncCompleted, lastSyncAt] = await Promise.all([
      this.syncRepository.isInitialSyncCompleted(),
      this.syncRepository.getLastSyncAt(),
    ]);

    return {
      isInitialSyncCompleted,
      lastSyncAt,
    };
  }
}
