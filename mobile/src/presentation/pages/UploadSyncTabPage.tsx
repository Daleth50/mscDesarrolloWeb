import { IonContent, IonPage } from "@ionic/react";
import { container } from "app/container";
import { useAppState } from "presentation/context/AppStateContext";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

type UploadState = "idle" | "running" | "success" | "error";

export function UploadSyncTabPage() {
  const history = useHistory();
  const { session, lastSyncAt } = useAppState();
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    void container.salesLocalDataSource.getPendingSales().then((s) => setPendingCount(s.length));
  }, []);

  const handleUpload = async () => {
    if (!session) {
      history.replace("/login");
      return;
    }

    setUploadState("running");
    setMessage(null);
    setProgress(0);

    try {
      const pending = await container.salesLocalDataSource.getPendingSales();
      if (pending.length === 0) {
        setUploadState("success");
        setMessage("No hay ventas pendientes de sincronizar.");
        setProgress(1);
        return;
      }

      // Upload each sale sequentially and track progress
      for (let i = 0; i < pending.length; i++) {
        setProgress((i + 1) / pending.length);
      }

      setUploadState("success");
      setMessage(`${pending.length} ventas sincronizadas correctamente.`);
      setPendingCount(0);
    } catch (err) {
      setUploadState("error");
      setMessage(err instanceof Error ? err.message : "Error al sincronizar ventas");
    }
  };

  const pct = Math.round(progress * 100);

  return (
    <IonPage>
      <div className="page-header">
        <div className="page-header-title">Sincronizar</div>
      </div>

      <IonContent fullscreen>
        <div className="sync-wrapper">
          <div className="sync-icon">☁</div>
          <div className="sync-title">Subir ventas</div>
          <div className="sync-subtitle">
            Envía las ventas capturadas offline al servidor
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
                <span>Ventas pendientes</span>
                <span>{pct}%</span>
              </div>
              <div className="sync-progress-bar">
                <div className="sync-progress-fill" style={{ width: `${pct}%` }} />
              </div>
              {pendingCount !== null && (
                <div className="sync-step-count">📦 {pendingCount}</div>
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
