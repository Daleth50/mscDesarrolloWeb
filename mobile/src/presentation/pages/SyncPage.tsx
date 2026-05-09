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
  customers: "Downloading customers...",
  categories: "Downloading categories...",
  products: "Downloading products and inventory...",
  bill_accounts: "Downloading payment accounts...",
};

export function SyncPage() {
  const history = useHistory();
  const { session, markSyncCompleted, logout } = useAppState();
  const [state, setState] = useState<SyncState>("idle");
  const [message, setMessage] = useState("Preparing synchronization...");
  const [currentStep, setCurrentStep] = useState<SyncStep | null>(null);
  const [summary, setSummary] = useState<string | null>(null);

  const progress = currentStep ? (STEPS.indexOf(currentStep) + 1) / STEPS.length : 0;

  const executeSync = async () => {
    if (!session) {
      history.replace("/login");
      return;
    }

    setState("running");
    setMessage("Starting synchronization...");
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
        `${result.customersCount} customers · ${result.productsCount} products · ${result.categoriesCount} categories · ${result.billAccountsCount} accounts`,
      );
      setMessage("Synchronization complete.");
      history.replace("/tabs/customers");
    } catch (err) {
      setState("error");
      setCurrentStep(null);
      const detail = err instanceof Error ? err.message : "Unknown sync error";
      setMessage(`Synchronization failed: ${detail}`);
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
          <IonTitle>Initial synchronization</IonTitle>
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
              Retry sync
            </IonButton>
          ) : null}

          <IonButton fill="outline" onClick={handleLogout} expand="block">
            Logout
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
