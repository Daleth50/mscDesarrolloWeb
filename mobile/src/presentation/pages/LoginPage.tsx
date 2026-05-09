import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonText,
} from "@ionic/react";
import { container } from "app/container";
import { useAppState } from "presentation/context/AppStateContext";
import { useState } from "react";
import { useHistory } from "react-router-dom";

export function LoginPage() {
  const history = useHistory();
  const { setSessionAfterLogin } = useAppState();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const session = await container.loginUseCase.execute(identifier, password);
      setSessionAfterLogin(session);
      history.replace("/sync");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding">
        <div className="auth-wrapper">
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Iniciar sesión</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonLabel position="stacked">Correo o usuario</IonLabel>
                <IonInput
                  value={identifier}
                  onIonInput={(event) => setIdentifier(event.detail.value || "")}
                  placeholder="john.doe"
                  autocomplete="username"
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">Contraseña</IonLabel>
                <IonInput
                  type="password"
                  value={password}
                  onIonInput={(event) => setPassword(event.detail.value || "")}
                  placeholder="••••••••"
                  autocomplete="current-password"
                />
              </IonItem>

              {error ? (
                <IonText color="danger">
                  <p>{error}</p>
                </IonText>
              ) : null}

              <IonButton
                expand="block"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="ion-margin-top"
              >
                {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
}
