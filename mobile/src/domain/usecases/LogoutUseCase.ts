import type { AuthRepository } from "domain/repositories/AuthRepository";
import type { SyncRepository } from "domain/repositories/SyncRepository";

export class LogoutUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly syncRepository: SyncRepository,
  ) {}

  async execute() {
    await this.authRepository.clearSession();
    await this.syncRepository.resetSyncState();
  }
}
