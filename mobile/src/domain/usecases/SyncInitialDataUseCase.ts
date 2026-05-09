import type { SyncRepository, SyncStep } from "domain/repositories/SyncRepository";

export class SyncInitialDataUseCase {
  constructor(private readonly syncRepository: SyncRepository) {}

  async execute(token: string, onStep?: (step: SyncStep) => void) {
    if (!token) {
      throw new Error("Session token is required");
    }

    return this.syncRepository.syncInitialData(token, onStep);
  }
}
