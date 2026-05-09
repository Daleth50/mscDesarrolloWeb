import { IonContent, IonPage } from "@ionic/react";
import { useRouteMatch } from "react-router-dom";

const LABELS: Record<string, string> = {
  "/tabs/returns": "Cambios",
  "/tabs/expenses": "Gastos",
  "/tabs/profile": "Perfil",
};

export function PlaceholderPage() {
  const match = useRouteMatch();
  const title = LABELS[match.url] ?? "Próximamente";

  return (
    <IonPage>
      <div className="page-header">
        <div className="page-header-title">{title}</div>
      </div>
      <IonContent fullscreen>
        <div className="screen-centered">
          <p style={{ color: "#999", fontSize: "14px" }}>Próximamente</p>
        </div>
      </IonContent>
    </IonPage>
  );
}
