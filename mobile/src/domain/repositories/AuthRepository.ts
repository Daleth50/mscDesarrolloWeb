import type { Session } from "../entities/Session";

export interface AuthRepository {
  login(identifier: string, password: string): Promise<Session>;
  getPersistedSession(): Promise<Session | null>;
  clearSession(): Promise<void>;
}
