import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { container } from "app/container";
import { useAppState } from "presentation/context/AppStateContext";
import { useState } from "react";
import { useHistory } from "react-router-dom";

export function SettingsTabPage() {
  const history = useHistory();
  const { session, lastSyncAt, logout, markSyncCompleted } = useAppState();
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleManualSync = async () => {
    if (!session) {
      history.replace("/login");
      return;
    }

    setSyncMessage(null);
    setIsSyncing(true);

    try {
      const result = await container.syncInitialDataUseCase.execute(session.token);
      markSyncCompleted(result.syncedAt);
      setSyncMessage(`Sincronización completada. ${result.customersCount} clientes actualizados.`);
    } catch (err) {
      const detail = err instanceof Error ? err.message : "Unknown error";
      setSyncMessage(`Error en la sincronización: ${detail}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    history.replace("/login");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Ajustes</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <IonList inset>
          <IonItem>
            <IonLabel>
              <h2>Sesión iniciada como</h2>
              <p>{session?.user.username || "Usuario desconocido"}</p>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <h2>Última sincronización</h2>
              <p>{lastSyncAt ? new Date(lastSyncAt).toLocaleString() : "Nunca"}</p>
            </IonLabel>
          </IonItem>
        </IonList>

        <IonButton expand="block" onClick={handleManualSync}>
          {isSyncing ? "Sincronizando..." : "Sincronizar ahora"}
        </IonButton>

        {syncMessage ? (
          <IonText color="medium">
            <p>{syncMessage}</p>
          </IonText>
        ) : null}

        <IonButton expand="block" fill="outline" color="danger" onClick={handleLogout}>
          Cerrar sesión
        </IonButton>
      </IonContent>
    </IonPage>
  );
}
