import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { container } from "app/container";
import { useAppState } from "presentation/context/AppStateContext";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

type UploadState = "idle" | "running" | "success" | "error";

export function UploadSyncTabPage() {
  const history = useHistory();
  const { session, lastSyncAt, notifySyncUpdate } = useAppState();
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [pendingCustomerCount, setPendingCustomerCount] = useState<number | null>(null);
  const [pendingExpensesCount, setPendingExpensesCount] = useState<number | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    void container.salesLocalDataSource.getPendingSales().then((s) => setPendingCount(s.length));
    void container.getLocalCustomersUseCase.execute().then((customers) => {
      setPendingCustomerCount(customers.filter((customer) => customer.pendingSync).length);
    });
    void container.getLocalExpensesUseCase.execute().then((expenses) => {
      setPendingExpensesCount(expenses.filter((e) => e.status === "pending_sync").length);
    });
  }, []);

  const handleUpload = async () => {
    if (!session) {
      history.replace("/login");
      return;
    }

    setUploadState("running");
    setMessage(null);

    try {
      // Sync sales and customers
      const salesResult = await container.syncPendingSalesUseCase.execute(session.token);
      
      // Sync expenses
      const expensesResult = await container.syncPendingExpensesUseCase.execute(session.token);

      setUploadState("success");
      const message = [
        `${salesResult.customersUploadedCount} clientes sincronizados`,
        `${salesResult.salesUploadedCount} ventas sincronizadas`,
        `${expensesResult.length} gastos sincronizados`,
      ]
        .filter((m) => m)
        .join(". ");

      setMessage(message || "No hay cambios pendientes de sincronizar.");
      setPendingCount(0);
      setPendingCustomerCount(0);
      setPendingExpensesCount(0);
      
      // Notify all components that sync has completed
      notifySyncUpdate();
    } catch (err) {
      setUploadState("error");
      setMessage(err instanceof Error ? err.message : "Error al sincronizar");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Sincronizar</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="sync-wrapper">
          <div className="sync-icon">☁</div>
          <div className="sync-title">Subir cambios</div>
          <div className="sync-subtitle">
            Envía los cambios capturados offline al servidor
          </div>

          {message && uploadState === "error" && (
            <div className="alert-error">{message}</div>
          )}

          {message && uploadState === "success" && (
            <div style={{ color: "#059862", fontSize: "13px", textAlign: "center" }}>{message}</div>
          )}

          <div className="sync-steps">
            <div className="sync-step">
              <div className="sync-step-header">
                <span>Clientes pendientes</span>
                <span>{pendingCustomerCount ?? 0}</span>
              </div>
              <div className="sync-progress-bar">
                <div className="sync-progress-fill" style={{ width: `${pendingCustomerCount ? 100 : 0}%` }} />
              </div>
              {pendingCustomerCount !== null && (
                <div className="sync-step-count">👤 {pendingCustomerCount}</div>
              )}
            </div>

            <div className="sync-step">
              <div className="sync-step-header">
                <span>Ventas pendientes</span>
                <span>{pendingCount ?? 0}</span>
              </div>
              <div className="sync-progress-bar">
                <div className="sync-progress-fill" style={{ width: `${pendingCount ? 100 : 0}%` }} />
              </div>
              {pendingCount !== null && (
                <div className="sync-step-count">📦 {pendingCount}</div>
              )}
            </div>

            <div className="sync-step">
              <div className="sync-step-header">
                <span>Gastos pendientes</span>
                <span>{pendingExpensesCount ?? 0}</span>
              </div>
              <div className="sync-progress-bar">
                <div className="sync-progress-fill" style={{ width: `${pendingExpensesCount ? 100 : 0}%` }} />
              </div>
              {pendingExpensesCount !== null && (
                <div className="sync-step-count">💰 {pendingExpensesCount}</div>
              )}
            </div>

            <div className="sync-step">
              <div className="sync-step-header">
                <span>Última sincronización</span>
              </div>
              <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>
                {lastSyncAt ? new Date(lastSyncAt).toLocaleString() : "Nunca"}
              </div>
            </div>
          </div>

          <button
            className="btn-primary"
            style={{ width: "100%", maxWidth: "320px" }}
            onClick={() => void handleUpload()}
            disabled={uploadState === "running"}
          >
            {uploadState === "running" ? "Sincronizando..." : "Sincronizar"}
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
}
