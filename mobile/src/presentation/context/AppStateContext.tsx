import { container } from "app/container";
import type { Session } from "domain/entities/Session";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

interface AppStateContextValue {
  isBootstrapping: boolean;
  session: Session | null;
  isInitialSyncCompleted: boolean;
  lastSyncAt: string | null;
  setSessionAfterLogin: (session: Session) => void;
  markSyncCompleted: (syncedAt: string) => void;
  logout: () => Promise<void>;
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

export function AppStateProvider({ children }: PropsWithChildren) {
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [isInitialSyncCompleted, setIsInitialSyncCompleted] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);

  const bootstrap = useCallback(async () => {
    setIsBootstrapping(true);

    try {
      const persistedSession = await container.getPersistedSessionUseCase.execute();
      setSession(persistedSession);

      if (!persistedSession) {
        setIsInitialSyncCompleted(false);
        setLastSyncAt(null);
        return;
      }

      const syncStatus = await container.getSyncStatusUseCase.execute();
      setIsInitialSyncCompleted(syncStatus.isInitialSyncCompleted);
      setLastSyncAt(syncStatus.lastSyncAt);
    } finally {
      setIsBootstrapping(false);
    }
  }, []);

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  const setSessionAfterLogin = useCallback((newSession: Session) => {
    setSession(newSession);
    setIsInitialSyncCompleted(false);
    setLastSyncAt(null);
  }, []);

  const markSyncCompleted = useCallback((syncedAt: string) => {
    setIsInitialSyncCompleted(true);
    setLastSyncAt(syncedAt);
  }, []);

  const logout = useCallback(async () => {
    await container.logoutUseCase.execute();
    setSession(null);
    setIsInitialSyncCompleted(false);
    setLastSyncAt(null);
  }, []);

  const value = useMemo(
    () => ({
      isBootstrapping,
      session,
      isInitialSyncCompleted,
      lastSyncAt,
      setSessionAfterLogin,
      markSyncCompleted,
      logout,
    }),
    [
      isBootstrapping,
      session,
      isInitialSyncCompleted,
      lastSyncAt,
      setSessionAfterLogin,
      markSyncCompleted,
      logout,
    ],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used inside AppStateProvider");
  }

  return context;
}
