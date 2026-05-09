import type { AuthRepository } from "domain/repositories/AuthRepository";

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  async execute(identifier: string, password: string) {
    const safeIdentifier = identifier.trim();
    if (!safeIdentifier || !password) {
      throw new Error("Identifier and password are required");
    }

    return this.authRepository.login(safeIdentifier, password);
  }
}
