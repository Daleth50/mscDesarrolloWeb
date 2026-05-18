import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonPage,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { chevronBackOutline } from "ionicons/icons";
import { container } from "app/container";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

type PageState = "idle" | "submitting" | "success" | "error";

export function CreateExpensePage() {
  const history = useHistory();

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [location, setLocation] = useState<{ latitude?: number; longitude?: number }>({});
  const [pageState, setPageState] = useState<PageState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Attempt to capture geolocation on mount
  useEffect(() => {
    const tryGetLocation = async () => {
      try {
        const mod = await import('@capacitor/geolocation').catch(() => null);
        if (mod && (mod as any).Geolocation) {
          const { Geolocation } = mod as any;
          const pos = await Geolocation.getCurrentPosition();
          if (pos && pos.coords) {
            setLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
            return;
          }
        }
      } catch (err) {
        console.warn('Geolocation plugin error:', err);
      }

      // Fallback to navigator.geolocation for web
      if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.warn('Geolocation error:', error);
            // Silent fail - location is optional
          },
        );
      }
    };

    void tryGetLocation();
  }, []);

  const isValid = amount && parseFloat(amount) > 0;

  const handleSave = async () => {
    setErrorMsg("");
    if (!amount || parseFloat(amount) <= 0) {
      setErrorMsg("El monto debe ser mayor a 0");
      return;
    }

    setPageState("submitting");

    try {
      await container.createExpenseUseCase.execute({
        amount: parseFloat(amount),
        note: note.trim() || undefined,
        latitude: location.latitude,
        longitude: location.longitude,
      });
      setPageState("success");
      setTimeout(() => {
        history.replace("/tabs/expenses");
      }, 500);
    } catch (err) {
      setPageState("error");
      setErrorMsg(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  if (pageState === "success") {
    return (
      <IonPage>
        <IonContent fullscreen className="ion-padding">
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <IonText>
              <h2 style={{ color: "var(--ion-color-success)" }}>¡Gasto registrado!</h2>
            </IonText>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => history.goBack()}>
              <IonIcon icon={chevronBackOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>Nuevo Gasto</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <div style={{ maxWidth: "500px", margin: "0 auto", marginTop: "1rem" }}>
          {/* Amount Input */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
              Monto *
            </label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ fontSize: "18px", marginRight: "0.5rem" }}>$</span>
              <IonInput
                type="number"
                placeholder="0.00"
                value={amount}
                onIonChange={(e) => setAmount(e.detail.value ?? "")}
                step="0.01"
                min="0.01"
                disabled={pageState === "submitting"}
                style={{ flex: 1 }}
              />
            </div>
          </div>

          {/* Note Input */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
              Descripción (opcional)
            </label>
            <IonInput
              type="text"
              placeholder="Ej: Gasolina, almuerzo..."
              value={note}
              onIonChange={(e) => setNote((e.detail.value ?? "").slice(0, 255))}
              disabled={pageState === "submitting"}
              maxlength={255}
            />
          </div>

          {/* Location Status */}
          <div style={{ marginBottom: "1.5rem", fontSize: "13px", color: "#666" }}>
            {location.latitude ? (
              <span>📍 Ubicación capturada</span>
            ) : (
              <span>📍 Ubicación no disponible</span>
            )}
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div
              style={{
                marginBottom: "1rem",
                padding: "0.75rem",
                backgroundColor: "#ffebee",
                color: "#d32f2f",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            >
              {errorMsg}
            </div>
          )}

          {/* Save Button */}
          <IonButton
            expand="block"
            disabled={!isValid || pageState === "submitting"}
            onClick={handleSave}
          >
            {pageState === "submitting" ? (
              <>
                <IonSpinner name="crescent" style={{ marginRight: "0.5rem" }} />
                Guardando...
              </>
            ) : (
              "Guardar Gasto"
            )}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
