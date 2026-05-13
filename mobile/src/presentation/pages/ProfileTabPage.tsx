import { IonAlert, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useAppState } from "presentation/context/AppStateContext";
import { useState } from "react";
import { useHistory } from "react-router-dom";

export function ProfileTabPage() {
  const history = useHistory();
  const { session, logout, resetSync } = useAppState();
  const [isResettingSync, setIsResettingSync] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleResetInitialSync = async () => {
    setIsResettingSync(true);
    try {
      await resetSync();
      history.push("/sync");
    } catch (err) {
      console.error("Error resetting sync:", err);
    } finally {
      setIsResettingSync(false);
    }
  };

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    try {
      await logout();
      history.replace("/login");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="profile-wrapper">
          {/* User Info Section */}
          <div className="profile-info">
            <div className="profile-avatar">👤</div>
            <div className="profile-details">
              <div className="profile-email">{session?.user?.email || "Usuario"}</div>
              <div className="profile-role">{session?.user?.role || "Sin rol"}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="profile-actions">
            <button
              className="btn-outline"
              onClick={() => void handleResetInitialSync()}
              disabled={isResettingSync}
            >
              {isResettingSync ? "Reiniciando..." : "Sincronización inicial"}
            </button>

            <button
              className="btn-danger"
              onClick={() => setShowLogoutConfirm(true)}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </IonContent>

      {/* Logout Confirmation Dialog */}
      <IonAlert
        isOpen={showLogoutConfirm}
        onDidDismiss={() => setShowLogoutConfirm(false)}
        header="Cerrar sesión"
        message="¿Estás seguro de que deseas cerrar sesión?"
        buttons={[
          {
            text: "Cancelar",
            role: "cancel",
            handler: () => {
              setShowLogoutConfirm(false);
            },
          },
          {
            text: "Cerrar sesión",
            role: "destructive",
            handler: () => {
              void handleLogout();
            },
          },
        ]}
      />
    </IonPage>
  );
}
