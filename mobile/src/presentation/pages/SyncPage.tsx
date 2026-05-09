import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonProgressBar,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { container } from "app/container";
import type { SyncStep } from "domain/repositories/SyncRepository";
import { useAppState } from "presentation/context/AppStateContext";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

type SyncState = "idle" | "running" | "success" | "error";

const STEPS: SyncStep[] = ["customers", "categories", "products", "bill_accounts"];

const STEP_LABELS: Record<SyncStep, string> = {
  customers: "Descargando clientes...",
  categories: "Descargando categorías...",
  products: "Descargando productos e inventario...",
  bill_accounts: "Descargando cuentas de cobro...",
};

export function SyncPage() {
  const history = useHistory();
  const { session, markSyncCompleted, logout } = useAppState();
  const [state, setState] = useState<SyncState>("idle");
  const [message, setMessage] = useState("Preparando sincronización...");
  const [currentStep, setCurrentStep] = useState<SyncStep | null>(null);
  const [summary, setSummary] = useState<string | null>(null);

  const progress = currentStep ? (STEPS.indexOf(currentStep) + 1) / STEPS.length : 0;

  const executeSync = async () => {
    if (!session) {
      history.replace("/login");
      return;
    }

    setState("running");
    setMessage("Iniciando sincronización...");
    setCurrentStep(null);
    setSummary(null);

    try {
      const result = await container.syncInitialDataUseCase.execute(
        session.token,
        (step) => {
          setCurrentStep(step);
          setMessage(STEP_LABELS[step]);
        },
      );

      markSyncCompleted(result.syncedAt);
      setState("success");
      setCurrentStep(null);
      setSummary(
        `${result.customersCount} clientes · ${result.productsCount} productos · ${result.categoriesCount} categorías · ${result.billAccountsCount} cuentas`,
      );
      setMessage("Sincronización completada.");
      history.replace("/tabs/customers");
    } catch (err) {
      setState("error");
      setCurrentStep(null);
      const detail = err instanceof Error ? err.message : "Error de sincronización desconocido";
      setMessage(`Error en la sincronización: ${detail}`);
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
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sincronización inicial</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding">
        <div className="screen-centered">
          {state === "running" ? (
            <>
              <IonSpinner name="crescent" />
              <IonProgressBar value={progress} style={{ marginTop: "1rem" }} />
            </>
          ) : null}

          <IonText>
            <p>{message}</p>
          </IonText>

          {summary ? (
            <IonText color="medium">
              <p style={{ fontSize: "0.85rem" }}>{summary}</p>
            </IonText>
          ) : null}

          {state === "error" ? (
            <IonButton onClick={executeSync} expand="block">
              Reintentar sincronización
            </IonButton>
          ) : null}

          <IonButton fill="outline" onClick={handleLogout} expand="block">
            Cerrar sesión
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
