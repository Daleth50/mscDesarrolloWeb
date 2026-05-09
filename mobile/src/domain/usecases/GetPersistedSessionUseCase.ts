import type { AuthRepository } from "domain/repositories/AuthRepository";

export class GetPersistedSessionUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute() {
    return this.authRepository.getPersistedSession();
  }
}
