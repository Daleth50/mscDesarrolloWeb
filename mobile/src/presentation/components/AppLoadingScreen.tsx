import { IonContent, IonPage, IonSpinner } from "@ionic/react";

export function AppLoadingScreen() {
  return (
    <IonPage>
      <IonContent className="ion-padding" fullscreen>
        <div className="screen-centered">
          <IonSpinner name="crescent" />
          <p>Cargando la aplicación...</p>
        </div>
      </IonContent>
    </IonPage>
  );
}
