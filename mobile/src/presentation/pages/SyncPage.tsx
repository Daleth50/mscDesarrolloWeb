import { IonContent, IonPage } from "@ionic/react";
import { container } from "app/container";
import type { SyncStep } from "domain/repositories/SyncRepository";
import { useAppState } from "presentation/context/AppStateContext";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

type SyncState = "idle" | "running" | "success" | "error";

const STEPS: SyncStep[] = ["customers", "categories", "products", "bill_accounts"];

const STEP_LABELS: Record<SyncStep, string> = {
  customers: "Clientes",
  categories: "Categorías",
  products: "Productos",
  bill_accounts: "Cuentas de cobro",
};

export function SyncPage() {
  const history = useHistory();
  const { session, markSyncCompleted, logout } = useAppState();
  const [state, setState] = useState<SyncState>("idle");
  const [currentStep, setCurrentStep] = useState<SyncStep | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [counts, setCounts] = useState<Partial<Record<SyncStep, number>>>({});

  const stepProgress = (step: SyncStep): number => {
    if (!currentStep) return state === "success" ? 1 : 0;
    const current = STEPS.indexOf(currentStep);
    const target = STEPS.indexOf(step);
    if (target < current) return 1;
    if (target === current) return 0.4;
    return 0;
  };

  const executeSync = async () => {
    if (!session) {
      history.replace("/login");
      return;
    }

    setState("running");
    setCurrentStep(null);
    setErrorMessage(null);
    setCounts({});

    try {
      const result = await container.syncInitialDataUseCase.execute(
        session.token,
        (step) => setCurrentStep(step),
      );

      markSyncCompleted(result.syncedAt);
      setCounts({
        customers: result.customersCount,
        categories: result.categoriesCount,
        products: result.productsCount,
        bill_accounts: result.billAccountsCount,
      });
      setState("success");
      setCurrentStep(null);
      history.replace("/tabs/customers");
    } catch (err) {
      setState("error");
      setCurrentStep(null);
      setErrorMessage(err instanceof Error ? err.message : "Error de sincronización desconocido");
    }
  };

  useEffect(() => {
    void executeSync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    await logout();
    history.replace("/login");
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="sync-wrapper">
          <div className="sync-icon">☁</div>
          <div className="sync-title">Sincronizar</div>
          <div className="sync-subtitle">
            {state === "running" ? "Descargando datos..." : "Asegúrate de tener datos sincronizados"}
          </div>

          {errorMessage && (
            <div className="alert-error">{errorMessage}</div>
          )}

          <div className="sync-steps">
            {STEPS.map((step) => {
              const progress = stepProgress(step);
              const count = counts[step];
              return (
                <div key={step} className="sync-step">
                  <div className="sync-step-header">
                    <span>{STEP_LABELS[step]}</span>
                    <span>{Math.round(progress * 100)}%</span>
                  </div>
                  <div className="sync-progress-bar">
                    <div className="sync-progress-fill" style={{ width: `${progress * 100}%` }} />
                  </div>
                  {count !== undefined && (
                    <div className="sync-step-count">📦 {count}</div>
                  )}
                </div>
              );
            })}
          </div>

          {state === "error" && (
            <button className="btn-primary" style={{ width: "100%", maxWidth: "320px" }} onClick={() => void executeSync()}>
              Reintentar sincronización
            </button>
          )}

          <button
            className="btn-outline"
            style={{ width: "100%", maxWidth: "320px" }}
            onClick={() => void handleLogout()}
          >
            Cerrar sesión
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
}
