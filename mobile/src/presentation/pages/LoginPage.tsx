import { IonContent, IonPage } from "@ionic/react";
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
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") void handleSubmit();
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="auth-wrapper">
          <div className="auth-logo" />
          <div className="auth-title">Inicia sesión</div>

          <div className="auth-form">
            <div>
              <div className="field-label">Email</div>
              <input
                className="field-input"
                type="email"
                placeholder="correo@empresa.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="username"
              />
            </div>

            <div>
              <div className="field-label">Contraseña</div>
              <input
                className="field-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="current-password"
              />
            </div>

            <div className="forgot-link">Olvidé mi contraseña</div>

            {error && (
              <div className="alert-error">{error}</div>
            )}

            <button
              className="btn-primary"
              onClick={() => void handleSubmit()}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Iniciando sesión..." : "Inicia sesión"}
            </button>

            <button className="btn-outline" onClick={() => void container.logoutUseCase.execute()}>
              Cerrar sesión
            </button>

            <div className="auth-footer">
              ¿No tienes cuenta? <span>Regístrate</span>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
}
