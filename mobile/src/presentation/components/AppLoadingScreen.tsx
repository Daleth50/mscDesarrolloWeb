import { IonContent, IonPage, IonSpinner } from "@ionic/react";

export function AppLoadingScreen() {
  return (
    <IonPage>
      <IonContent className="ion-padding" fullscreen>
        <div className="screen-centered">
          <IonSpinner name="crescent" />
          <p>Loading mobile app...</p>
        </div>
      </IonContent>
    </IonPage>
  );
}
