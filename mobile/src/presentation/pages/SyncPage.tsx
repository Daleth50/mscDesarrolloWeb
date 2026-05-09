import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { container } from "app/container";
import { useAppState } from "presentation/context/AppStateContext";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

type SyncState = "idle" | "running" | "success" | "error";

export function SyncPage() {
  const history = useHistory();
  const { session, markSyncCompleted, logout } = useAppState();
  const [state, setState] = useState<SyncState>("idle");
  const [message, setMessage] = useState("Preparing initial synchronization...");

  const executeSync = async () => {
    if (!session) {
      history.replace("/login");
      return;
    }

    setState("running");
    setMessage("Downloading customers from backend...");

    try {
      const result = await container.syncInitialDataUseCase.execute(session.token);
      markSyncCompleted(result.syncedAt);
      setState("success");
      setMessage(`Synchronized ${result.customersCount} customers.`);
      history.replace("/tabs/customers");
    } catch (err) {
      setState("error");
      const detail = err instanceof Error ? err.message : "Unknown sync error";
      setMessage(`Synchronization failed: ${detail}`);
    }
  };

  useEffect(() => {
    void executeSync();
    // run once when screen opens
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
          {state === "running" ? <IonSpinner name="crescent" /> : null}
          <IonText>
            <p>{message}</p>
          </IonText>

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
