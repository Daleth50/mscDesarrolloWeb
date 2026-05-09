import type { Session } from "domain/entities/Session";
import { sessionStore } from "infrastructure/storage/localDb";

const SESSION_KEY = "active_session";

export class SessionLocalDataSource {
  async saveSession(session: Session): Promise<void> {
    await sessionStore.setItem(SESSION_KEY, session);
  }

  async getSession(): Promise<Session | null> {
    const session = await sessionStore.getItem<Session>(SESSION_KEY);
    return session || null;
  }

  async clearSession(): Promise<void> {
    await sessionStore.removeItem(SESSION_KEY);
  }
}
