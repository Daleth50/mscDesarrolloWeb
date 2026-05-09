import type { Session } from "domain/entities/Session";
import type { AuthRepository } from "domain/repositories/AuthRepository";
import { SessionLocalDataSource } from "data/datasources/local/SessionLocalDataSource";
import { AuthRemoteDataSource } from "data/datasources/remote/AuthRemoteDataSource";

export class AuthRepositoryImpl implements AuthRepository {
  constructor(
    private readonly authRemoteDataSource: AuthRemoteDataSource,
    private readonly sessionLocalDataSource: SessionLocalDataSource,
  ) {}

  async login(identifier: string, password: string): Promise<Session> {
    const session = await this.authRemoteDataSource.login(identifier, password);
    await this.sessionLocalDataSource.saveSession(session);
    return session;
  }

  async getPersistedSession(): Promise<Session | null> {
    return this.sessionLocalDataSource.getSession();
  }

  async clearSession(): Promise<void> {
    await this.sessionLocalDataSource.clearSession();
  }
}
