import { container, globalAuthHandler } from "app/container";
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
  resetSync: () => Promise<void>;
  logout: () => Promise<void>;
  syncUpdateTrigger: number;
  notifySyncUpdate: () => void;
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

export function AppStateProvider({ children }: PropsWithChildren) {
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [isInitialSyncCompleted, setIsInitialSyncCompleted] = useState(false);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);

  const [syncUpdateTrigger, setSyncUpdateTrigger] = useState(0);

  const notifySyncUpdate = useCallback(() => {
    setSyncUpdateTrigger((prev) => prev + 1);
  }, []);
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

  const resetSync = useCallback(async () => {
    await container.syncRepository.resetSyncState();
    setIsInitialSyncCompleted(false);
    setLastSyncAt(null);
  }, []);

  const logout = useCallback(async () => {
    await container.logoutUseCase.execute();
    setSession(null);
    setIsInitialSyncCompleted(false);
    setLastSyncAt(null);
  }, []);

  // Set up the global 401 handler to call logout when unauthorized
  useEffect(() => {
    globalAuthHandler.onUnauthorized = () => {
      void logout();
    };
  }, [logout]);

  const value = useMemo(
    () => ({
      isBootstrapping,
      session,
      isInitialSyncCompleted,
      lastSyncAt,
      setSessionAfterLogin,
      markSyncCompleted,
      resetSync,
      logout,
      syncUpdateTrigger,
      notifySyncUpdate,
    }),
    [
        syncUpdateTrigger,
        notifySyncUpdate,
      isBootstrapping,
      session,
      isInitialSyncCompleted,
      lastSyncAt,
      setSessionAfterLogin,
      markSyncCompleted,
      resetSync,
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
